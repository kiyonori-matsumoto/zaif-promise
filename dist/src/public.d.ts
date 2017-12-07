export declare namespace Public {
    interface LastPriceResponse {
        last_price: number;
    }
    interface TickerResponse {
        last: number;
        high: number;
        low: number;
        vwap: number;
        volume: number;
        bid: number;
        ask: number;
    }
    interface TradesResponse {
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
        trade_type: 'ask' | 'bid';
    }
    interface DepthResponse {
        asks: Array<{
            price: number;
            amount: number;
        }>;
        bids: Array<{
            price: number;
            amount: number;
        }>;
    }
    interface CurrencyResponse {
        /** 通貨の名前 */
        name: string;
        /**token種別 */
        is_token: boolean;
    }
    interface CurrencyPairResponse {
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
    function last_price(currency_pair?: string): Promise<LastPriceResponse>;
    function ticker(currency_pair?: string): Promise<TickerResponse>;
    function trades(currency_pair?: string): Promise<TradesResponse[]>;
    function depth(currency_pair?: string): Promise<DepthResponse>;
    function currencies(currency?: string): Promise<CurrencyResponse[]>;
    function currency_pairs(currency_pair?: string): Promise<CurrencyPairResponse[]>;
}
