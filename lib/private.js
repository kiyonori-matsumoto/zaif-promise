const rp = require('request-promise-native');
const qs = require('qs');
const crypto = require('crypto');
const retry = require('./retry');

let key = process.env.ZAIF_KEY;
let secret = process.env.ZAIF_SECRET;

const METHOD_NAMES = [
  'get_info', 'get_info2', 'get_personal_info', 'trade_history', 'active_orders', 'trade',
  'cancel_order', 'withdraw', 'deposit_history', 'withdraw_history'
]

const private_methods = METHOD_NAMES.reduce( (a, e) => {
  a[e] = (query=null) => {
    if(!key || !secret) {
      return Promise.reject({message: "private method needs key and secret"});
    }
    const timestamp = Date.now() / 1000.0;

    const body = {
      nonce: timestamp,
      method: e
    }

    const form = qs.stringify(Object.assign({}, body, query))
    const sign = crypto.createHmac('sha512', secret).update(form).digest('hex');

    const options = {
      url: 'https://api.zaif.jp/tapi',
      method: 'POST',
      headers: {
        Key: key,
        Sign: sign,
      },
      body: form
    };
    retry.add(e, options)
    return rp(options).then(JSON.parse).then( (d) => {
      if(d.success === 0) {
        return Promise.reject(new Error(d.error));
      } else {
        return Promise.resolve(d.return);
      }
    });
  }
  return a;
}, {});

private_methods._setCredentials = (_key, _secret) => {
  key = _key;
  secret = _secret;
}

module.exports = private_methods;
