"use strict"

let twispay = require('./Twispay'),
    twispaySample = require('./TwispaySample')

// normally you get the encrypted data from the HTTP request (POST/GET) in the `opensslResult` parameter
let encryptedIpnResponse = twispaySample.getEncryptedIpnResponse()

// your secret key
let secretKey = twispaySample.getSecretKey()

if (process.argv.length == 4) {
    console.log("Arguments provided for encrypted IPN response and secret key.")
    encryptedIpnResponse = process.argv[2]
    secretKey = process.argv[3]
} else {
    console.log("No arguments provided for encrypted IPN response and secret key, using sample values!")
}

console.log("encryptedIpnResponse: " + encryptedIpnResponse)
console.log("secretKey: " + secretKey)

// get the JSON IPN response
let jsonResponse = twispay.decryptIpnResponse(encryptedIpnResponse, secretKey)

console.log("Decrypted IPN response: " + JSON.stringify(jsonResponse, null, 4))
