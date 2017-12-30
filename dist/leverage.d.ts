import { RequestBase } from "./request_base";
export declare class Leverage extends RequestBase {
    constructor(key?: string, secret?: string);
    get_positions(option: GetPositionRequest): Promise<{
        [id: string]: GetPositionResponse;
    }>;
    position_history(option: PositionHistoryRequest): Promise<{
        [id: string]: PositionHistoryResponse;
    }>;
    active_positions(option: ActivePositionRequest): Promise<{
        [id: string]: ActivePositionResponse;
    }>;
    create_position(option: CreatePositionRequest): Promise<CreatePositionResponse>;
    change_position(option: ChangePositionRequest): Promise<ChangePositionResponse>;
    cancel_position(option: CancelPositionRequest): Promise<CancelPositionResponse>;
}
export interface GetPositionRequest {
    type: 'margin' | 'futures';
    group_id?: number;
    from?: number;
    count?: number;
    from_id?: number;
    end_id?: number;
    order?: 'ASC' | 'DESC';
    since?: number;
    end?: number;
    currency_pair?: string;
}
export interface GetPositionResponse {
    group_id: number;
    currency_pair: string;
    action: 'bid' | 'ask';
    amount: number;
    price: number;
    limit: number;
    stop: number;
    timestamp: number;
    term_end: number;
    leverage: number;
    fee_spent: number;
    timestamp_closed: number;
    price_avg: number;
    amount_done: number;
    close_avg: number;
    close_done: number;
    swap: number;
    guard_fee: number;
    [x: string]: any;
}
export interface PositionHistoryRequest {
    type: 'margin' | 'futures';
    group_id?: number;
    leverage_id: number;
}
export interface PositionHistoryResponse {
    group_id: number;
    currency_pair: string;
    action: 'bid' | 'ask';
    amount: number;
    price: number;
    timestamp: number;
    your_action: 'bid' | 'ask' | 'both';
    bid_leverage_id: number;
    ask_leverage_id: number;
}
export interface ActivePositionRequest {
    type: 'margin' | 'futures';
    group_id?: number;
    currency_pair?: string;
}
export interface ActivePositionResponse {
    group_id: number;
    currency_pair: string;
    action: 'bid' | 'ask';
    amount: number;
    price: number;
    limit: number;
    stop: number;
    timestamp: number;
    term_end: number;
    leverage: number;
    fee_spent: number;
    price_avg: number;
    amount_done: number;
    close_avg: number;
    close_done: number;
    swap: number;
    [x: string]: any;
}
export interface CreatePositionRequest {
    type: 'margin' | 'futures';
    group_id?: number;
    currency_pair: string;
    action: 'bid' | 'ask';
    price: number;
    amount: number;
    leverage: number;
    limit?: number;
    stop?: number;
}
export interface CreatePositionResponse {
    leverage_id: number;
    timestamp: number;
    term_end: number;
    price_avg: number;
    amount_done: number;
    funds: {
        [currency: string]: number;
    };
    [x: string]: any;
}
export interface ChangePositionRequest {
    type: 'margin' | 'futures';
    group_id?: number;
    leverage_id: number;
    price: number;
    limit?: number;
    stop?: number;
}
export interface ChangePositionResponse {
    leverage_id: number;
    timestamp_closed: number;
    price_avg: number;
    amount_done: number;
    close_avg: number;
    close_done: number;
    swap: number;
    guard_fee: number;
    [x: string]: any;
}
export interface CancelPositionRequest {
    type: 'margin' | 'futures';
    group_id?: number;
    leverage_id: number;
}
export interface CancelPositionResponse {
    leverage_id: number;
    fee_spent: number;
    timestamp_closed: number;
    price_avg: number;
    amount_done: number;
    close_avg: number;
    close_done: number;
    [x: string]: any;
    swap: number;
    guard_fee: number;
    funds: {
        [currency: string]: number;
    };
}
