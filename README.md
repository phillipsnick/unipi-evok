# UniPi Evok 

Node JS wrapper for UniPi EVOK REST and WebSocket API as documented at [https://evok-1.api-docs.io/1.01].

*Note this only supports EVOK v2.0*

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
    port: 80
})


unipi
    .on('connected', () => {
        // logic once connected here
    })
    .connect()
```

## Properties

TODO

## Methods

Note internal methods are not documented.

### connect()

Fetch a list of all devices to be stored under `unipi.devices()` then connect to the WebSocket server on the UniPi. 

__Arguments__

None

__Example__

```js
unipi.connect()
```

---------------------------------------

### close()

__Arguments__

None

__Example__

```js
unipi.on('connected', () => {
    // logic when connected
    // now close the connection
    unipi.close()
})
```

### url()

### send(message)

### get()

### devices()

## Events


## Examples


## Notes

This is currently been kept quite basic due to time constraints, feel free to submit issues for features/pull requests.

## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/unipi-evok/blob/master/LICENSE)
