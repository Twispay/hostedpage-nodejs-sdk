"use strict"

module.exports = class {
    static getBase64JsonRequest(orderData) {
        let jsonText = JSON.stringify(orderData)
        return Buffer.alloc(Buffer.byteLength(jsonText), jsonText).toString('base64')
    }

    static getBase64Checksum(orderData, secretKey) {
        let crypto = require('crypto'),
            hmacSha512 = crypto.createHmac('sha512', secretKey)
        hmacSha512.update(JSON.stringify(orderData))
        return hmacSha512.digest('base64')
    }

    static getHtmlOrderForm(orderData, secretKey, twispayLive = false) {
        let base64JsonRequest = this.getBase64JsonRequest(orderData),
            base64Checksum = this.getBase64Checksum(orderData, secretKey),
            hostName = twispayLive ? "secure.twispay.com" : "secure-stage.twispay.com"
        return `<form action="https://${hostName}" method="post" accept-charset="UTF-8">
    <input type="hidden" name="jsonRequest" value="${base64JsonRequest}">
    <input type="hidden" name="checksum" value="${base64Checksum}">
    <input type="submit" value="Pay">
</form>`
    }

    static decryptIpnResponse(encryptedIpnResponse, secretKey) {
        // get the IV and the encrypted data
        let encryptedParts = encryptedIpnResponse.split(',', 2),
            iv = Buffer.from(encryptedParts[0], 'base64'),
            encryptedData = Buffer.from(encryptedParts[1], 'base64')

        // decrypt the encrypted data
        let crypto = require('crypto'),
            decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv),
            decryptedIpnResponse = Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString()

        // JSON decode the decrypted data
        return JSON.parse(decryptedIpnResponse)
    }
}
