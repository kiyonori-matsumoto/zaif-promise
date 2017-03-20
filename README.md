# zaif-promise
API helper for ZAIF.

## How to
```javascript
const zaif = require('zaif-promise');

zaif.depth()
.then(console.log)
.catch( (err) => {
  console.log(err.message);
})
```

## Set credential
key and secret are specified by following order

1. call zaif.setCredentials(key, secret);
2. set Environment Variable ZAIF\_KEY and ZAIF\_SECRET

## With options
```javascript
const zaif = require('zaif-promise');

zaif.trade({
  currency_pair: 'btc_jpy',
  action: 'bid',
  price: 100000,
  amount: 0.001
})
.then(console.log()
.catch( (err) => {
  console.error(err.message);
})
```

## Retry
You can retry latest order.
```javascript
const zaif = require('zaif-promise');

zaif.trade({
  currency_pair: 'btc_jpy', action: 'bid', price: 100000, amount: 0.001
})
.then(console.log())
.catch( (err) => {
  console.error(err.message);
  return zaif.retry('trade')
  .then( (d) => {
    console.log("success transaction")
  }).catch( (err) => {
    console.error(err.message);
  })
})
```

## Supported order
All private and public apis are on supported.

## Any issues?
please notify me on https://github.com/kiyonori-matsumoto/zaif-promise/issues

## If you like this or want to try:
https://zaif.jp?ac=0w8b7hiizs
