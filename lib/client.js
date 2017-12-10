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

    connect() {
        this.client.connect(this.wsUrl())
        return this
    }

    close() {
        this.ws.close()
        return this
    }

    // GET via REST API
    get(url) {
        return new Promise((resolve, reject) => {
            request(`${this.restUrl()}${url}`, (err, res, body) => {
                if (err || res.statusCode !== 200) {
                    return reject(err)
                }

                resolve(JSON.parse(body))
            })
        })

    }

    // POST via REST API
    post() {
        //TODO
    }

    // send via WebSocket
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
        this.ws.on('close', () => {
            this.emit('close')
        })
        this.ws.on('error', (err) => {
            this.emit('error', err)
        })
    }

    receive(message) {
        this.emit('message', JSON.parse(message.utf8Data))
    }
}

module.exports = client
