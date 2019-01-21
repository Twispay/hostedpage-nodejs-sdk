"use strict"

/**
 * The module implements methods to get the value
 * of `jsonRequest` and `checksum` that need to be sent by POST
 * when making a Twispay order and to decrypt the Twispay IPN response.
 */
module.exports = class {
    /**
     * Get the `jsonRequest` parameter (order parameters as JSON and base64 encoded).
     *
     * @param {object} orderData The order parameters.
     *
     * @returns {string}
     */
    static getBase64JsonRequest(orderData) {
        let jsonText = JSON.stringify(orderData)
        return Buffer.alloc(Buffer.byteLength(jsonText), jsonText).toString('base64')
    }

    /**
     * Get the `checksum` parameter (the checksum computed over the `jsonRequest` and base64 encoded).
     *
     * @param {object} orderData The order parameters.
     * @param {string} secretKey The secret key (from Twispay).
     *
     * @returns {PromiseLike<ArrayBuffer>}
     */
    static getBase64Checksum(orderData, secretKey) {
        let crypto = require('crypto'),
            hmacSha512 = crypto.createHmac('sha512', secretKey)
        hmacSha512.update(JSON.stringify(orderData))
        return hmacSha512.digest('base64')
    }

    /**
     * Decrypt the IPN response from Twispay.
     *
     * @param {string} encryptedIpnResponse
     * @param {string} secretKey The secret key (from Twispay).
     *
     * @returns {object}
     */
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
