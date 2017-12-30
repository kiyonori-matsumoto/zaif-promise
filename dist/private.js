"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require("qs");
const crypto = require("crypto");
const rp = require("request-promise-native");
const config_1 = require("./config");
const AsyncLock = require('async-lock');
var Private;
(function (Private) {
    let key = process.env.ZAIF_KEY || '';
    let secret = process.env.ZAIF_SECRET || '';
    let timestamp = Date.now() / 1000.0;
    const lock = new AsyncLock();
    function set_credentials(_key, _secret) {
        key = _key;
        secret = _secret;
    }
    Private.set_credentials = set_credentials;
    function build_options(method, query) {
        timestamp = timestamp + 0.001;
        const body = {
            nonce: timestamp,
            method: method,
        };
        const form = qs.stringify(Object.assign({}, body, query));
        const sign = crypto.createHmac('sha512', secret).update(form).digest('hex');
        const options = {
            url: config_1.Config.endpoint + '/tapi',
            method: 'POST',
            headers: {
                Key: key,
                Sign: sign,
            },
            body: form
        };
        return options;
    }
    function send_request(method, query = {}) {
        if (!key || !secret) {
            return Promise.reject(new Error('Private methods need key and secret'));
        }
        return lock.acquire(key, () => {
            const options = build_options(method, query);
            let time = 10;
            let tries = 0;
            const delayRun = (w, f) => new Promise(resolve => {
                setTimeout(() => resolve(f()), w);
            });
            const exe = () => rp(options)
                .then(JSON.parse)
                .then(data => {
                if (data.success === 0) {
                    return Promise.reject(new Error(data.error));
                }
                else {
                    return Promise.resolve(data.return);
                }
            });
            return exe()
                .catch(e => {
                console.error(e);
                tries++;
                if (tries > 10) {
                    Promise.reject(e);
                }
                time *= 2;
                return delayRun(time, exe);
            });
        });
    }
    function get_info() {
        return send_request('get_info');
    }
    Private.get_info = get_info;
    function get_info2() {
        return send_request('get_info2');
    }
    Private.get_info2 = get_info2;
    function get_personal_info() {
        return send_request('get_personal_info');
    }
    Private.get_personal_info = get_personal_info;
    function get_id_info() {
        return send_request('get_id_info');
    }
    Private.get_id_info = get_id_info;
    function trade_history(query) {
        return send_request('trade_history', query);
    }
    Private.trade_history = trade_history;
    function active_orders(query) {
        return send_request('active_orders', query);
    }
    Private.active_orders = active_orders;
    function trade(query) {
        return send_request('trade', query);
    }
    Private.trade = trade;
    function cancel_order(query) {
        return send_request('cancel_order', query);
    }
    Private.cancel_order = cancel_order;
    function withdraw(query) {
        return send_request('withdraw', query);
    }
    Private.withdraw = withdraw;
    function deposit_history(query) {
        return send_request('deposit_history', query);
    }
    Private.deposit_history = deposit_history;
    function withdraw_history(query) {
        return send_request('withdraw_history', query);
    }
    Private.withdraw_history = withdraw_history;
})(Private = exports.Private || (exports.Private = {}));
