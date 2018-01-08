import { Zaif } from './index';

import 'mocha';
import { expect } from 'chai';
import * as nock from 'nock';
import { fail } from 'assert';
const base = 'https://api.zaif.jp';

describe('Zaif', () => {
  let zaif: Zaif;

  before(() => {
    zaif = new Zaif();
  })

  describe('initialize', () => {
    it('can instanciate', () => {
      expect(zaif).not.to.be.null;
      expect(typeof zaif.Public.currencies).to.equal('function');
    })
  })

  describe('#trades', () => {
    it('can get', () => {
      const exp = [
        {
          "date": 1491756592,
          "price": 135340.0,
          "amount": 0.02,
          "tid": 43054307,
          "currency_pair": "btc_jpy",
          "trade_type": "ask"
        },
        {
          "date": 1491756591,
          "price": 135345.0,
          "amount": 0.01,
          "tid": 43054306,
          "currency_pair": "btc_jpy",
          "trade_type": "bid"
        },
      ]
      const scope = nock(base)
        .get('/api/1/trades/btc_jpy')
        .reply(200, exp);
      return zaif.Public.trades().then(data => {
        expect(data).to.deep.equal(exp);
        expect(data[0].trade_type).to.equals('ask');
        expect(scope.isDone()).to.be.true;
      })
    })
  })

  describe('#get_info', () => {
    beforeEach(() => {
      zaif = new Zaif('key', 'secret');
    })

    it('can get', () => {
      const res = {
        "funds": {
          "jpy": 15320,
          "btc": 1.389,
          "xem": 100.2,
          "mona": 2600,
          "pepecash": 0.1
        },
        "deposit": {
          "jpy": 20440,
          "btc": 1.479,
          "xem": 100.2,
          "mona": 3200,
          "pepecash": 0.1
        },
        "rights": {
          "info": 1,
          "trade": 1,
          "withdraw": 0,
          "personal_info": 0,
          "id_info": 0,
        },
        "trade_count": 18,
        "open_orders": 3,
        "server_time": 1401950833
      }
      const scope = nock(base)
      .post('/tapi', /nonce=.*&method=get_info/, {reqheaders: {'key': 'key', 'sign': /.+/}})
      .reply(200, {success: 1, return: res})

      return zaif.Private.get_info().then(data => {
        expect(data).to.deep.equal(res);
        expect(scope.isDone()).is.true;
      })
    })
    
    it('throws collec error', () => {
      const scope = nock(base)
      .post('/tapi')
      .reply(400, {success: 0, return: 'invalid access token'})

      return zaif.Private.get_info().then(() => {
        fail;
      }).catch(reason => {
        expect(reason.message === 'invalid access token');
        expect(scope.isDone()).to.be.true;
      })
    })
  })
})
