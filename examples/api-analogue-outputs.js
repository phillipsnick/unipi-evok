"use strict"

const evok = require('../lib/api')
const unipi = new evok(require('./config'))

unipi
    .on('error', (err) => {
        console.log('Error', err)
    })
    .on('connected', () => {
        console.log('Connected!')

        // set analogue outputs to 5v
        unipi.analogueOutputs().forEach((output) => {
            unipi.analogueOutput(output.circuit, 5)
        })
    })
    .on('ao', (output) => {
        console.log(`Analogue output value changed: ${output.circuit} to ${output.value}`)
    })
    .connect()

process.on('SIGINT', () => {
    console.log("Caught interrupt signal")

    unipi.close()
})
