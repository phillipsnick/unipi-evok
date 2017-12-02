"use strict"

const client = require('./client')

class evok extends client {
    constructor(options) {
        super(options)

        this.on('message', this.parse.bind(this))
    }

    connect() {
        this.get('/rest/all')
            .then((body) => {
                this.deviceList = body
                super.connect()
            })
            .catch((err) => {
                this.emit('error', err)
            })
    }

    devices() {
        if (typeof this.deviceList === 'undefined') {
            throw `Device list not ready`
        }

        return this.deviceList
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

        this.set(relay.dev, relay.circuit, state)
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

        this.set(output.dev, output.circuit, state)
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

        this.set(led.dev, led.circuit, state)
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
        let output = this.analogueOutputs().find(device => device.circuit === circuit)

        if (!output) {
            throw `Invalid analogue output: ${circuit}`
        }

        if (typeof state === 'undefined') {
            return output.value === 1
        }

        this.set(output.dev, output.circuit, state)
    }

    owDevices() {
        //TODO:
    }

    set(dev, circuit, state) {
        if (typeof state === 'boolean') {
            state = state ? '1' : '0'
        }

        this.send({
            cmd: 'set',
            dev: dev,
            circuit: circuit,
            value: state
        })
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
