# UniPi Evok 

Node JS wrapper for UniPi EVOK REST and WebSocket API as documented at [EVOK Documentation](https://evok-1.api-docs.io/1.01).

*Note this only supports EVOK API v2.0*

## Installation

```bash
npm i unipi-evok
```

## Usage

A number of examples can be found within the [examples directory](https://github.com/phillipsnick/unipi-evok/tree/master/examples).

At it's most basic level we can connect to the UniPi using:

```js
const evok = require('../lib/api')
const unipi = new evok({
    host: 'IP_ADDRESS',
    restPort: 80
    wsPort: 8080
})

unipi
    .on('connected', () => {
        // logic once connected here
    })
    .connect()
```

## Properties

* `host` - DNS hostname or IP address
* `restPort` - Port of EVOK REST API - Default is 80
* `wsPort` - Port of EVOK WebSocket API - Default is 8080

## Client Methods

Note internal methods are not documented.

### connect()

Fetch a list of all devices to be stored under `unipi.devices()` then connect to the WebSocket server on the UniPi. 

__Example__

```js
unipi.connect()
```

---------------------------------------

### close()

__Example__

```js
unipi.on('connected', () => {
    // logic when connected
    // now close the connection
    unipi.close()
})
```

### restUrl()

Return a string of the base REST URL.

__Example__

```js
unipi.restUrl() // http://localhost:80
```

### wsUrl()

Return a string of the base WebSocket URL.

__Example__

```js
unipi.wsUrl() // http://localhost:8080
``` 

### get(url)

Return a promise after performing a GET request.

__Arguments__

* `url` - Relative URL on the EVOK API

__Example__

```js
unipi.get('/rest/all')
    .then((devices) => {
        // devices = array of objects
    })
``` 

### post()

TODO

### send(message)

Send JSON object via the WebSocket

__Arguments__

* `message` - JSON object

__Example__

```js
unipi.send({
    cmd: 'set',
    dev: 'relay',
    circuit: '2_01',
    value: '1'
})
```

## API Methods

This is the default class which extends [client.js](https://github.com/phillipsnick/unipi-evok/tree/master/lib/client.js).

### connect()

Extends the client.js connect method by first fetching a list of devices via the REST API.

### devices()

__Example__

```js
unipi.devices() // array of objects returned from the API 
```

### device(dev, circuit) 

Find a device from the list of devices

__Arguments__

* `dev` - Device as defined on EVOK API, eg `ao`
* `circuit` - Circuit as defined on EVOK API

__Example__

```js
let device = unipi.device('relay', '2_05')
```

### inputs()

Digital inputs filtered from the device list.

__Example__

```js
unipi.connect()
```

### input(circuit)

TODO

### relays()

Relays filtered from the device list.

__Example__

```js
unipi.relays() // array of objects
```

### relay(circuit, state)

Either get the current state of the relay or set a new state. Note this will not return the state when setting.

__Arguments__

* `circuit` - Circuit as defined on the API
* `state` - Optional state of true/false

__Examples__

Get the state

```js
unipi.relay('2_01') // true/false
```

Set the state

```js
unipi.relay('2_01', true) 
```

### digitalOutputs()

Digital outputs filtered from the device list.

__Example__

```js
unipi.digitalOutputs() // array of objects
```

### digitalOutput(circuit, state)

Either get the current state of a digital output or set a new state. Note this will not return the state when setting.

__Arguments__

* `circuit` - Circuit as defined on the API
* `state` - Optional state of true/false

__Examples__

Get the state

```js
unipi.digitalOutput('2_01') // true/false
```

Set the state

```js
unipi.digitalOutput('2_01', true) 
```

### leds()

LEDs filtered from the device list.

__Example__

```js
unipi.leds() // array of objects
```

### led(circuit, state)

Either get the current state of a LED or set a new state. Note this will not return the state when setting.

__Arguments__

* `circuit` - Circuit as defined on the API
* `state` - Optional state of true/false

__Examples__

Get the state

```js
unipi.led('2_01') // true/false
```

Set the state

```js
unipi.led('2_01', true) 
```

### analogueInputs()

Analogue inputs filtered from the device list.

__Example__

```js
unipi.analogueInputs() // array of objects
```

### analogueInput()

TODO

### analogueOutputs()

Analogue outputs filtered from the device list.

__Example__

```js
unipi.analogueOutputs() // array of objects
```

### analogueOutput(circuit, state)

Either get the current state of an analogue output or set a new state. Note this will not return the state when setting.

__Arguments__

* `circuit` - Circuit as defined on the API
* `state` - Optional value between 0-10 (no validation on this)

__Examples__

Get the state

```js
unipi.analogueOutput('2_01') // true/false
```

Set the output to 5v

```js
unipi.analogueOutput('2_01', 5) 
```

### owDevices

TODO

### set(dev, circuit, state)

Shorthand method for setting values on the WebSocket API.

__Arguments__

* `dev` - Dev as defined on the API
* `circuit` - Circuit as defined on the API
* `value` - Boolean or float

__Example__

Set a relay on

```js
unipi.set('relay', '2_01', true)
```

## Events

### Module events

Created by this module.

#### connect

Emitted on connect of the WebSocket.

#### connectFailed

Emitted when we failed to connect to the WebSocket

#### message

When any message is received via the WebSocket.

__Example__

```js
unipi.on('message', (message) => {
    // message = [{
    //     modes: [ 'Voltage', 'Current', 'Resistance' ],
    //     value: 2.1998616187837583,
    //     glob_dev_id: 1,
    //     dev: 'ao',
    //     circuit: '1_01',
    //     unit: 'V',
    //     mode: 'Voltage' 
    // }]
})
````

#### error

Emitted when theres an error.

#### close

Emitted when the WebSocket connection is closed.

### EVOK Events

By default we emit events based on the type of device which has made a change.

__Arguments__

* `device` - Latest data emitted from EVOK API
* `device` - Last stored data from `devices()` prior to event, note this may be null in some cases

Note these do not necessarily mean the value changed, nor should they be considered 100% reliable as race conditions may occur.

__Example__

```js
unipi.on('message', (device, devicePrevious) => {
    console.log(device) // latest data from the EVOK API
    console.log(devicePrevious) // null or previous data stored in our local array of devices prior to message
})
```

#### input

When a digital input message is received.

#### relay

When a relay message is received.

#### digitalOutput

When a digital output message is received.

#### ai

When analogue input message is received.

#### ao

When analogue output message is received.

#### led

When LED message is received.

#### wd

When a watchdog message is received

#### neuron
#### uart
#### wifi

## Notes

__This is currently a work in progress.__

## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/unipi-evok/blob/master/LICENSE)
