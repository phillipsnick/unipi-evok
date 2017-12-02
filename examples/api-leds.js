"use strict"

const evok = require('../lib/api')
const unipi = new evok(require('./config'))

unipi
    .on('error', (err) => {
        console.log('Error', err)
    })
    .on('connected', () => {
        console.log('Connected!')

        // invert the LED states
        unipi.leds().forEach((led) => {
            unipi.led(led.circuit, !unipi.led(led.circuit))
        })
    })
    .on('led', (led) => {
        //TODO: only gets emitted once?
        console.log(`LED value changed: ${led.circuit} to ${led.value === 1 ? 'true' : 'false'}`)
    })
    .connect()

process.on('SIGINT', () => {
    console.log("Caught interrupt signal")

    unipi.close()
})
