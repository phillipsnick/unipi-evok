"use strict"

const evok = require('../lib/api')
const unipi = new evok(require('./config'))

unipi
    .on('error', (err) => {
        console.log('Error', err)
    })
    .on('connected', () => {
        console.log('Connected!')
        console.log('Devices', unipi.devices())
    })
    .connect()

process.on('SIGINT', () => {
    console.log("Caught interrupt signal")

    unipi.close()
})
