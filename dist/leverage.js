"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_base_1 = require("./request_base");
class Leverage extends request_base_1.RequestBase {
    constructor(key, secret) {
        super('/tlapi', key, secret);
    }
    get_positions(option) {
        return this.send_request('get_positions', option);
    }
    position_history(option) {
        return this.send_request('position_history', option);
    }
    active_positions(option) {
        return this.send_request('active_positions', option);
    }
    create_position(option) {
        return this.send_request('create_position', option);
    }
    change_position(option) {
        return this.send_request('change_position', option);
    }
    cancel_position(option) {
        return this.send_request('cancel_position', option);
    }
}
exports.Leverage = Leverage;
