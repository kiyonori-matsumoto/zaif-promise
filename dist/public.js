"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise-native");
const config_1 = require("./config");
var Public;
(function (Public) {
    function send_request(path, currency_pairs, query = {}) {
        path = `/api/1/${path}/${currency_pairs}`;
        const options = {
            url: config_1.Config.endpoint + path,
            method: 'GET',
            json: true,
            query: query
        };
        return rp(options);
    }
    ;
    ;
    ;
    ;
    function last_price(currency_pair = 'btc_jpy') {
        return send_request('last_price', currency_pair);
    }
    Public.last_price = last_price;
    function ticker(currency_pair = 'btc_jpy') {
        return send_request('ticker', currency_pair);
    }
    Public.ticker = ticker;
    function trades(currency_pair = 'btc_jpy') {
        return send_request('trades', currency_pair);
    }
    Public.trades = trades;
    function depth(currency_pair = 'btc_jpy') {
        return send_request('depth', currency_pair)
            .then((e) => {
            const mapping = (e) => { return { price: e[0], amount: e[1] }; };
            return {
                asks: e.asks.map(mapping),
                bids: e.bids.map(mapping)
            };
        });
    }
    Public.depth = depth;
    function currencies(currency = 'all') {
        return send_request('currencies', currency);
    }
    Public.currencies = currencies;
    function currency_pairs(currency_pair = 'all') {
        return send_request('currency_pairs', currency_pair);
    }
    Public.currency_pairs = currency_pairs;
})(Public = exports.Public || (exports.Public = {}));
