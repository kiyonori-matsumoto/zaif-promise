# zaif-promise
API helper for ZAIF.

## How to
```javascript
const zaif = require('zaif-promise');

zaif.Public.depth()
.then(console.log)
.catch( (err) => {
  console.log(err.message);
})
```

### how about typescript?
```typescript
import {Zaif} from 'zaif-promise';
const zaif = new Zaif();

zaif.Public.depth()
.then(console.log)
.catch((err) => {
  console.log(err.message);
})
```

## Set credential
key and secret are specified by following order

1. call zaif.setCredentials(key, secret);
2. set Environment Variable ZAIF\_KEY and ZAIF\_SECRET

```typescript
import {Zaif} from 'zaif-promise';
const zaif = new Zaif('key', 'secret');
```

## With options
```javascript
const zaif = require('zaif-promise');

zaif.Private.trade({
  currency_pair: 'btc_jpy',
  action: 'bid',
  price: 100000,
  amount: 0.001
})
.then(console.log)
.catch(err => {
  console.error(err.message);
})
```

## Retry
Private api retries automatically if request failed.

## Supported order
All private, leverage and public apis are on supported.
check [ZAIF API Description](http://techbureau-api-document.readthedocs.io/ja/latest/index.html) page for detail.

## Any issues?
please notify me on https://github.com/kiyonori-matsumoto/zaif-promise/issues

## If you like this or want to try:
please register your account from here: https://zaif.jp?ac=0w8b7hiizs

or give me some tips!
- btc: `15GnXQuw23udU8APYF8ayFeYVHnzZE38GZ`
- bch: `16eF3vBMgRB2QMsKhx7yN9LEq5g3m5pyfq`
- mona: `MSZcFBzwAeUrYBA8f6EDJRyQqc2n5p3Usq`

