"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_base_1 = require("./request_base");
const AsyncLock = require('async-lock');
const lock = new AsyncLock();
class V2Private extends request_base_1.RequestBase {
    constructor(key, secret) {
        super('/tapi', key, secret);
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
