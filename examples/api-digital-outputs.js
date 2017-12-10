"use strict"

const evok = require('../lib/api')
const unipi = new evok(require('./config'))

unipi
    .on('error', (err) => {
        console.log('Error', err)
    })
    .on('connected', () => {
        console.log('Connected!')

        // invert the digital output states
        unipi.digitalOutputs().forEach((output) => {
            unipi.digitalOutput(output.circuit, !unipi.output(output.circuit))
        })
    })
    .on('output', (output) => {
        console.log(`Digital output value changed: ${output.circuit} to ${output.value === 1 ? 'true' : 'false'}`)
    })
    .connect()

process.on('SIGINT', () => {
    console.log("Caught interrupt signal")

    unipi.close()
})
