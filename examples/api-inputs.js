"use strict"

const evok = require('../lib/api')
const unipi = new evok(require('./config'))

unipi
    .on('error', (err) => {
        console.log('Error', err)
    })
    .on('connected', () => {
        console.log('Connected!')

        // initial input states
        unipi.inputs().forEach((input) => {
            console.log(`Input ${input.circuit} state is ${input.value === 1 ? 'true' : 'false'}`)
        })
    })
    .on('input', (input) => {
        console.log(`Input value changed: ${input.circuit} to ${input.value === 1 ? 'true' : 'false'}`)
    })
    .connect()

process.on('SIGINT', () => {
    console.log("Caught interrupt signal")

    unipi.close()
})
