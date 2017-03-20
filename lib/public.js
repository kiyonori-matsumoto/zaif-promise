const rp = require('request-promise-native');
const config = require('./config');

public_methods = [
  'last_price', 'ticker', 'trades', 'depth', 'currency_pairs', 'currencies'
].reduce( (a, e) => {
  a[e] = (query = {}) => {
    const default_cp = (e === 'currencies' || e === 'currency_pairs') ? 'all' : 'btc_jpy'
    const currency_pairs = query.currency_pairs || config.currency_pairs ||
                          default_cp;
    const path = `/api/1/${e}/${currency_pairs}`;
    const method = 'GET';

    const options = {
      url: 'https://api.zaif.jp' + path,
      method: method,
      json: true,
      query: query
    };
    return rp(options);
  }
  return a
}, {})

module.exports = public_methods;
