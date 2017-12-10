import * as rp from 'request-promise-native';
import { Config } from './config';

export namespace Public {

  function send_request(path: string, currency_pairs: string, query: any = {}): any {
    path = `/api/1/${path}/${currency_pairs}`;
    const options = {
      url: Config.endpoint + path,
      method: 'GET',
      json: true,
      query: query
    };
    return rp(options)
  };

  export interface LastPriceResponse {
    last_price: number;
  };

  export interface TickerResponse {
    last: number;
    high: number;
    low: number;
    vwap: number;
    volume: number;
    bid: number;
    ask: number;
  };

  export interface TradesResponse {
    /**取引日時 */
    date: number;
    /**取引価格 */
    price: number;
    /**取引量 */
    amount: number;
    /**取引ID */
    tid: number;
    /**通貨ペア */
    currency_pair: string;
    /**取引種別 */
    trade_type: 'ask'|'bid';
  };

  export interface DepthResponse {
    asks: Array<{price: number, amount: number}>,
    bids: Array<{price: number, amount: number}>,
  }

  export interface CurrencyResponse {
    /** 通貨の名前 */
    name: string;
    /**token種別 */
    is_token: boolean;
  }

  export interface CurrencyPairResponse {
    /**通貨ペアの名前 */
    name: string;
    /**通貨ペアのタイトル */
    title: string; 
    /** 通貨ペアのシステム文字列 */
    currency_pair: string; 	
    /** 通貨ペアの詳細 */
    description: string; 	
    /** token種別 */	
    is_token: boolean; 
    /** イベントトークンの場合、0以外 */
    event_number: number; 	
    /** 通貨シークエンス */
    seq: number; 	
    /** アイテム通貨最小値 */
    item_unit_min: number; 	
    /** アイテム通貨入力単位 */
    item_unit_step: number;	
    /** アイテム通貨 日本語表記 */
    item_japanese: string; 	
    /** 相手通貨最小値 */
    aux_unit_min: number; 	
    /** 相手通貨入力単位 */
    aux_unit_step: number; 	
    /** 相手通貨小数点 */
    aux_unit_point: number; 	
    /** 相手通貨 日本語表記 */	
    aux_japanese: number; 
  }

  export function last_price(currency_pair: string = 'btc_jpy'): 
    Promise<LastPriceResponse> {
    return send_request('last_price', currency_pair);
  }

  export function ticker(currency_pair: string = 'btc_jpy'): Promise<TickerResponse> {
    return send_request('ticker', currency_pair);
  }

  export function trades(currency_pair: string = 'btc_jpy'): Promise<TradesResponse[]> {
    return send_request('trades', currency_pair);
  }

  export function depth(currency_pair: string = 'btc_jpy'): Promise<DepthResponse> {
    return send_request('depth', currency_pair)
    .then((e: any) => {
      const mapping = (e: number[]) => { return {price: e[0], amount: e[1]}};
      return {
        asks: e.asks.map(mapping),
        bids: e.bids.map(mapping)
      }
    })
  }

  export function currencies(currency: string = 'all'): Promise<CurrencyResponse[]> {
    return send_request('currencies', currency);
  }

  export function currency_pairs(currency_pair: string = 'all'): Promise<CurrencyPairResponse[]> {
    return send_request('currency_pairs', currency_pair);
  }
}
