"use strict"

const evok = require('../lib/client')
const unipi = new evok(require('./config'))

unipi
    .on('connected', () => {
        console.log('Connected!')
        console.log(`Found ${unipi.devices.length} devices`)
    })
    .on('error', (err) => {
        console.log('Error', err)
    })
    .on('data', (message) => {
        console.log('Received', message)
    })
    .connect()

process.on('SIGINT', () => {
    console.log("Caught interrupt signal")

    unipi.close()
})
