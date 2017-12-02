"use strict"

const evok = require('../lib/client')
const unipi = new evok(require('./config'))

unipi
    .on('connected', () => {
        console.log('Connected!')
    })
    .on('error', (err) => {
        console.log('Error', err)
    })
    .on('message', (message) => {
        console.log('Received', message)
    })
    .connect()

process.on('SIGINT', () => {
    console.log("Caught interrupt signal")

    unipi.close()
})
