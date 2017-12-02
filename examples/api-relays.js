"use strict"

const evok = require('../lib/api')
const unipi = new evok(require('./config'))

unipi
    .on('error', (err) => {
        console.log('Error', err)
    })
    .on('connected', () => {
        console.log('Connected!')

        // invert the relay states
        unipi.relays().forEach((relay) => {
            unipi.relay(relay.circuit, !unipi.relay(relay.circuit))
        })
    })
    .on('relay', (relay) => {
        console.log(`Relay value changed: ${relay.circuit} to ${relay.value === 1 ? 'true' : 'false'}`)
    })
    .connect()

process.on('SIGINT', () => {
    console.log("Caught interrupt signal")

    unipi.close()
})
