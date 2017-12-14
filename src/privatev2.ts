import * as qs from 'qs';
import * as crypto from 'crypto';
import * as rp from 'request-promise-native';
import { Config } from './config';

const AsyncLock = require('async-lock');

const lock = new AsyncLock();

export class V2Private {
  
  private key = process.env.ZAIF_KEY || '';
  private secret = process.env.ZAIF_SECRET || '';
  private timestamp = Date.now() / 1000.0;

  public constructor(key?: string, secret?:string) {
    if(key) { this.key = key }
    if(secret) { this.secret = secret }
  }

  public set_credentials(_key: string, _secret: string) {
    this.key = _key;
    this.secret = _secret;
  }

  private build_options(method: string, query: any) {
    this.timestamp = this.timestamp + 0.001;

    const body = {
      nonce: this.timestamp,
      method: method,
    }

    const form = qs.stringify(Object.assign({}, body, query));
    const sign = crypto.createHmac('sha512', this.secret).update(form).digest('hex');

    const options = {
      url: Config.endpoint + '/tapi',
      method: 'POST',
      headers: {
        Key: this.key,
        Sign: sign,
      },
      body: form
    };
    return options;
  }

  private send_request(method: string, query: any = {}) {
    if (!this.key || !this.secret) {
      return Promise.reject(new Error('Private methods need key and secret'));
    }

    return lock.acquire(this.key, () => {
      const options = this.build_options(method, query);

      let time = 10;
      let tries = 0;

      const delayRun = (w: number, f: any) => new Promise(resolve => {
        setTimeout(() => resolve(f()), w)
      })

      const exe = () => 
        rp(options)
        .then(JSON.parse)
        .then(data => {
          if(data.success === 0) {
            return Promise.reject(new Error(data.error));
          } else {
            return Promise.resolve(data.return);
          }
        })

      return exe()
      .catch(e => {
        console.error(e);
        tries ++;
        if (tries > 10) {
          Promise.reject(e);
        }
        time *= 2;
        return delayRun(time, exe);
      })
    })
  }

  public get_info(): Promise<GetInfoReqponse> {
    return this.send_request('get_info');
  }

  public get_info2(): Promise<GetInfo2Reqponse> {
    return this.send_request('get_info2');
  }

  public get_personal_info(): Promise<GetPersonalInfoResponse> {
    return this.send_request('get_personal_info');
  }

  public get_id_info(): Promise<GetIdInfoResponse> {
    return this.send_request('get_id_info');
  }

  public trade_history(query: TradeHistoryRequest): Promise<TradeHistoryResponse> {
    return this.send_request('trade_history', query);
  }


  public active_orders(query: ActiveOrdersRequest): Promise<ActiveOrdersResponse> {
    return this.send_request('active_orders', query);
  }

  public trade(query: TradeRequest): Promise<TradeResponse> {
    return this.send_request('trade', query);
  }

  public cancel_order(query: CancelOrderRequest): Promise<CancelOrderResponse> {
    return this.send_request('cancel_order', query);
  }

  public withdraw(query: WithdrawRequest): Promise<WithdrawResponse> {
    return this.send_request('withdraw', query);
  }

  public deposit_history(query: DepositHistoryRequest): Promise<DepositHistoryResponse> {
    return this.send_request('deposit_history', query);
  }

  public withdraw_history(query: WithdrawHistoryRequest): Promise<WithdrawHistoryResponse> {
    return this.send_request('withdraw_history', query);
  }
}

export interface GetInfoReqponse {
  funds: { [currency: string]: number; },
  deposit: { [currency: string]: number; },
  rights: {
    info: number;
    trade: number;
    withdraw: number;
    personal_info: number;
    id_info: number;
  },
  trade_count: number;
  open_orders: number;
  server_time: number;
}

export interface GetInfo2Reqponse {
  funds: { [currency: string]: number; },
  deposit: { [currency: string]: number; },
  rights: {
    info: number;
    trade: number;
    withdraw: number;
    personal_info: number;
    id_info: number;
  },
  open_orders: number;
  server_time: number;
}

export interface GetPersonalInfoResponse {
  /**ニックネーム */
  ranking_nickname: string;
  /**画像のパス */
  icon_path: string;
}

export interface GetIdInfoResponse {
  /**ユーザーid */
  id: string;
  /**メールアドレス */
  email: string;
  /**名前 */
  name: string;
  /**名前カナ */
  kana: string;
  /**認証済み */
  certified: boolean;
}

export interface TradeHistoryRequest {
  /**この順番のレコードから取得 */
  from?: number;
  /**取得するレコード数 */
  count?: number;
  /**このトランザクションIDのレコードから取得 */
  from_id?: number;
  /**このトランザクションのIDのレコードまで取得 */
  end_id?: number;
  /**ソート順 */
  order?: 'ASC'|'DESC';
  /**開始タイムスタンプ */
  since?: number;
  /**終了タイムスタンプ */
  end?: number;
  /**通貨ペア。指定なしでbtc_jpy/mona_jpy/mona_btc/xem_jpy/xem_btc。eth_jpyやbch_jpyなどは指定の必要あり */
  currency_pair?: string;
  /**【非推奨、削除予定】true：カウンターパーティトークンの情報を取得 false：カウンターパーティトークン以外の情報を取得 */
  is_token?: boolean;
}

export interface TradeHistoryResponse {
  [order_id: string]: {
    /**通貨ペア */
    currency_pair: string;
    /**bid(買い) or ask(売り) */
    action: 'bid'|'ask';
    /**数量 */
    amount: number;
    /**価格 */
    price: number;
    /**手数料 */
    fee: number;
    /**bidまたはask、自己取引の場合はbothとなります */
    your_action: 'bid'|'ask'|'both'
    /**マイナス手数料分 */
    bonus: number;
    /**取引日時 */
    timestamp: number;
    /**注文のコメント */
    comment: string;
  }
}

export interface ActiveOrdersRequest {
  /**取得する通貨ペア。
   * 公開情報APIのcurrency_pairsで取得できるものが指定できます。
   * 指定なしで全ての通貨ペアの情報を取得します。 
   * */
  currency_pair?: string;
  /**【非推奨、削除予定】
   * true：カウンターパーティトークンの情報を取得 
   * false：カウンターパーティトークン以外の情報を取得 
   * */
  is_token?: boolean;
  /**【非推奨、削除予定】
   * true：全てのアクティブなオーダー情報を取得 
   * false：currency_pairやis_tokenに従ったオーダー情報を取得 
   * */
  is_token_both?: boolean;
}

export interface TradeRequest {
  /**通貨ペア */
  currency_pair: string;
  /**bid(買い) or ask(売り) */
  action: 'bid'|'ask';
  /**数量 */
  amount: number;
  /**価格 */
  price: number;
  /**リミット注文価格 */
  limit?: number;
  /**コメントの追加 */
  comment?: string;
}

export interface TradeResponse {
  /**今回の注文で約定した取引量 */
  received: number;
  /**今回の注文で約定せず、板に残った取引量 */
  remains: number;
  /**今回の注文がすべて成立した場合は0、一部、もしくはすべて約定しなかった場合は板に残った注文のID。 */
  order_id: number;
  /**残高 */
  funds: {[currency: string]: number};
}

export interface ActiveOrdersResponse {
  [order_id: string]: {
    /**通貨ペア */
    currency_pair: string;
    /**bid(買い) or ask(売り) */
    action: 'bid'|'ask';
    /**数量 */
    amount: number;
    /**価格 */
    price: number;
    /**発注日時 */
    timestamp: number;
    /**注文のコメント */
    comment: string;
  }
}

export interface CancelOrderRequest {
  /**注文ID（tradeまたはactive_ordersで取得できます） */
  order_id: number;
  /**通貨ペア。 */
  currency_pair?: string;
  /**
   * 【非推奨、削除予定】
   * true：カウンターパーティトークンのオーダーを取り消したい時　
   * false：カウンターパーティトークン以外のオーダーを取り消したい時
   * */
  is_token?: boolean;
}

export interface CancelOrderResponse {
  /**注文id */
  order_id: number;
  /**残高 */
  funds: {[currency: string]: number};
}

export interface WithdrawRequest {
  /**引き出す通貨。公開情報APIのcurrenciesで取得できるものが指定できます。ただしjpyは指定できません。 */
  currency: string;
  /**送信先のアドレス */
  address: string;
  /**送信メッセージ(XEMのみ) */
  message?: string;
  /**引き出す金額(例: 0.3) */
  amount: number;
  /**採掘者への手数料(例: 0.003) ただしcurrencyがbtc、mona以外の時に指定するとエラーとなります。 */
  opt_fee?: number;
}

export interface WithdrawResponse {
  /**振替ID */
  txid?: string;
  /**今回の引き出しにかかった手数料 */
  fee: number;
  /**残高 */
  funds: {[currency: string]: number};
}

export interface DepositHistoryRequest {
  /**通貨。公開情報APIのcurrenciesで取得できるものが指定できます。 */
  currency: string;
  /**この順番のレコードから取得 */
  from?: number;
  /**取得するレコード数 */
  count?: number;
  /**このトランザクションIDのレコードから取得 */
  from_id?: number;
  /**このトランザクションのIDのレコードまで取得 */
  end_id?: number;
  /**ソート順 */
  order?: 'ASC'|'DESC';
  /**開始タイムスタンプ */
  since?: number;
  /**終了タイムスタンプ */
  end?: number;
}

export interface DepositHistoryResponse {
  /**出金日時 */
  timestamp: number;
  /**出金先アドレス */
  address: string;
  /**取引量 */
  amount: number;
  /**トランザクションid */
  txid: string;
}

export interface WithdrawHistoryRequest {
  /**通貨。公開情報APIのcurrenciesで取得できるものが指定できます。 */
  currency: string;
  /**この順番のレコードから取得 */
  from?: number;
  /**取得するレコード数 */
  count?: number;
  /**このトランザクションIDのレコードから取得 */
  from_id?: number;
  /**このトランザクションのIDのレコードまで取得 */
  end_id?: number;
  /**ソート順 */
  order?: 'ASC'|'DESC';
  /**開始タイムスタンプ */
  since?: number;
  /**終了タイムスタンプ */
  end?: number;
}

export interface WithdrawHistoryResponse {
  /**出金日時 */
  timestamp: number;
  /**出金先アドレス */
  address: string;
  /**取引量 */
  amount: number;
  /**トランザクションid */
  txid: string;
}
