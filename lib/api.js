"use strict"

const client = require('./client')

class evok extends client {
    constructor(options) {
        super(options)

        this.on('message', this.parse.bind(this))
    }

    inputs() {
        return this.devices().filter(device => device.dev === 'input')
    }

    input(circuit) {
        //TODO: input state?
    }

    relays() {
        return this.devices().filter(device => device.dev === 'relay' && device.relay_type === 'physical')
    }

    relay(circuit, state) {
        let relay = this.relays().find(device => device.circuit === circuit)

        if (!relay) {
            throw `Invalid relay: ${circuit}`
        }

        if (typeof state === 'undefined') {
            return relay.value === 1
        }

        this.send({
            cmd: 'set',
            dev: 'relay',
            circuit: circuit,
            value: state === true ? '1' : '0'
        })
    }

    // digital outputs only
    outputs() {
        return this.devices().filter(device => device.dev === 'relay' && device.relay_type === 'digital')
    }

    output(circuit, state) {
        let output = this.outputs().find(device => device.circuit === circuit)

        if (!output) {
            throw `Invalid digital output: ${circuit}`
        }

        if (typeof state === 'undefined') {
            return output.value === 1
        }

        this.send({
            cmd: 'set',
            dev: 'relay',
            circuit: circuit,
            value: state === true ? '1' : '0'
        })
    }

    leds() {
        return this.devices().filter(device => device.dev === 'led')
    }

    led(circuit, state) {
        let led = this.leds().find(device => device.circuit === circuit)

        if (!led) {
            throw `Invalid LED: ${circuit}`
        }

        if (typeof state === 'undefined') {
            return led.value === 1
        }

        this.send({
            cmd: 'set',
            dev: 'led',
            circuit: circuit,
            value: state === true ? '1' : '0'
        })
    }

    analogueInputs() {
        return this.devices().filter(device => device.dev === 'ai')
    }

    analogueInput() {
        //TODO:
    }

    analogueOutputs() {
        return this.devices().filter(device => device.dev === 'ao')
    }

    analogueOutput(circuit, state) {
        let output = this.outputs().find(device => device.circuit === circuit)

        if (!output) {
            throw `Invalid analogue output: ${circuit}`
        }

        if (typeof state === 'undefined') {
            return output.value === 1
        }

        this.send({
            cmd: 'set',
            dev: 'ao',
            circuit: circuit,
            value: state
        })
    }

    owDevices() {
        //TODO:
    }

    parse(message) {
        // handle devices
        message.forEach((device) => {
            switch (device.dev) {
                case 'relay':
                    this.emit(device.relay_type === 'physical' ? 'relay' : 'output', device)
                    break

                default:
                    this.emit(device.dev, device)
            }

            //TODO: we need to replace this in devicesList
        })
    }
}

module.exports = evok
