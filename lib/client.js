"use strict"

const EventEmitter = require('events')
const request = require('request')
const WebSocketClient = require('websocket').client

class client extends EventEmitter {
    constructor(options) {
        super()

        this.options = options

        this.client = new WebSocketClient()
        this.client.on('connect', this.connected.bind(this))
        this.client.on('connectFailed', this.connectFailed.bind(this))
    }

    restUrl() {
        return `http://${this.options.host}:${this.options.restPort}`
    }

    wsUrl() {
        return `ws://${this.options.host}:${this.options.wsPort}/ws`
    }

    devices() {
        if (!this.devicelist) {
            throw `Device list not ready`
        }

        return this.devicelist
    }

    connect() {
        //TODO: consider moving this to api.js
        request(`${this.restUrl()}/rest/all`, (err, res, body) => {
            if (err || res.statusCode !== 200) {
                this.emit('error', err)
                return
            }

            this.devicelist = JSON.parse(body)
            this.client.connect(this.wsUrl())
        })

        return this
    }

    close() {
        this.get().close()
        return this
    }

    get() {
        if (!this.ws) {
            throw 'No WebSocket connection established.'
        }

        if (!this.ws.connected) {
            throw 'No WebSocket connection active.'
        }

        return this.ws
    }

    send(message) {
        if (typeof message !== 'object') {
            throw 'send payload must be an object'
        }

        this.ws.sendUTF(JSON.stringify(message))
        return this
    }

    // internal methods
    connected(conneciton) {
        this.register(conneciton)
        this.emit('connected')
    }

    connectFailed(e) {
        this.emit('connectFailed', e)
    }

    register(conneciton) {
        this.ws = conneciton
        this.ws.on('message', this.receive.bind(this))
        //TODO: error
        //TODO: close
        //TODO: ping?
        //TODO: pong?
    }

    receive(message) {
        this.emit('message', JSON.parse(message.utf8Data))
    }
}

module.exports = client

//TODO: keep alive?