"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require("qs");
const crypto = require("crypto");
const rp = require("request-promise-native");
const config_1 = require("./config");
const AsyncLock = require('async-lock');
const lock = new AsyncLock();
class V2Private {
    constructor(key, secret) {
        this.key = process.env.ZAIF_KEY || '';
        this.secret = process.env.ZAIF_SECRET || '';
        this.timestamp = Date.now() / 1000.0;
        if (key) {
            this.key = key;
        }
        if (secret) {
            this.secret = secret;
        }
    }
    set_credentials(_key, _secret) {
        this.key = _key;
        this.secret = _secret;
    }
    build_options(method, query) {
        this.timestamp = this.timestamp + 0.001;
        const body = {
            nonce: this.timestamp,
            method: method,
        };
        const form = qs.stringify(Object.assign({}, body, query));
        const sign = crypto.createHmac('sha512', this.secret).update(form).digest('hex');
        const options = {
            url: config_1.Config.endpoint + '/tapi',
            method: 'POST',
            headers: {
                Key: this.key,
                Sign: sign,
            },
            body: form
        };
        return options;
    }
    send_request(method, query = {}) {
        if (!this.key || !this.secret) {
            return Promise.reject(new Error('Private methods need key and secret'));
        }
        return lock.acquire(this.key, () => {
            const options = this.build_options(method, query);
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
    get_info() {
        return this.send_request('get_info');
    }
    get_info2() {
        return this.send_request('get_info2');
    }
    get_personal_info() {
        return this.send_request('get_personal_info');
    }
    get_id_info() {
        return this.send_request('get_id_info');
    }
    trade_history(query) {
        return this.send_request('trade_history', query);
    }
    active_orders(query) {
        return this.send_request('active_orders', query);
    }
    trade(query) {
        return this.send_request('trade', query);
    }
    cancel_order(query) {
        return this.send_request('cancel_order', query);
    }
    withdraw(query) {
        return this.send_request('withdraw', query);
    }
    deposit_history(query) {
        return this.send_request('deposit_history', query);
    }
    withdraw_history(query) {
        return this.send_request('withdraw_history', query);
    }
}
exports.V2Private = V2Private;
