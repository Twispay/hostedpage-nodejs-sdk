"use strict"

let twispay = require('./Twispay'),
    twispaySample = require('./TwispaySample')

// get the data as JSON text
let jsonOrderData = twispaySample.getOrderData()

// your secret key
let secretKey = twispaySample.getSecretKey()

if (process.argv.length == 4) {
    console.log("Arguments provided for JSON order data and secret key.")
    jsonOrderData = JSON.parse(process.argv[2])
    secretKey = process.argv[3]
} else {
    console.log("No arguments provided for JSON order data and secret key, using sample values!")
}

console.log("jsonOrderData: " + JSON.stringify(jsonOrderData))
console.log("secretKey: " + secretKey)

// get the HTML form
let htmlForm = twispay.getHtmlOrderForm(jsonOrderData, secretKey)

console.log("Generated HTML form: " + htmlForm)
