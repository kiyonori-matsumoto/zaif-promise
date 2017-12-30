import { RequestBase } from "./request_base";

export class Leverage extends RequestBase {
  public constructor(key?: string, secret?: string) {
    super('/tlapi', key, secret);
  }

  public get_positions(option: GetPositionRequest): Promise<{[id: string]: GetPositionResponse}> {
    return this.send_request('get_positions', option);
  }

  public position_history(option: PositionHistoryRequest): Promise<{[id: string]: PositionHistoryResponse}> {
    return this.send_request('position_history', option);
  }

  public active_positions(option: ActivePositionRequest): Promise<{[id: string]: ActivePositionResponse}> {
    return this.send_request('active_positions', option);
  }

  public create_position(option: CreatePositionRequest): Promise<CreatePositionResponse> {
    return this.send_request('create_position', option);
  }

  public change_position(option: ChangePositionRequest): Promise<ChangePositionResponse> {
    return this.send_request('change_position', option);
  }

  public cancel_position(option: CancelPositionRequest): Promise<CancelPositionResponse> {
    return this.send_request('cancel_position', option);
  }
}

export interface GetPositionRequest {
  type: 'margin'|'futures'; ///	Yes	marginまたはfutures	str	 
  group_id?: number; ///	Yes/No	type=futuresの場合は必須	int	 
  from?: number; ///	No	この順番のレコードから取得	int	0
  count?: number; ///	No	取得するレコード数	int	1000
  from_id?: number; ///	No	このトランザクションIDのレコードから取得	int	0
  end_id?: number; ///	No	このトランザクションIDのレコードまで取得	int	infinity
  order?: 'ASC'|'DESC'; ///	No	ソート順	ASC (昇順)もしくは DESC (降順)	DESC
  since?: number; ///	No	開始タイムスタンプ	UNIX_TIMESTAMP	0
  end?: number; ///	No	終了タイムスタンプ	UNIX_TIMESTAMP	infinity
  currency_pair?: string; ///	No	通貨ペア。指定なしで全ての通貨ペア	(例) btc_jpy	
}

export interface GetPositionResponse {
  group_id: number; ///	グループID	int
  currency_pair: string; ///	通貨ペア	str
  action: 'bid'|'ask'; ///	bid(買い) or ask(売り)	str
  amount: number; ///	数量	float
  price: number; ///	価格	float
  limit: number; ///	リミット価格	float
  stop: number; ///	ストップ価格	float
  timestamp: number; ///	発注日時	UNIX_TIMESTAMP
  term_end: number; ///	注文の有効期限	UNIX_TIMESTAMP
  leverage: number; ///	レバレッジ	float
  fee_spent: number; ///	支払い手数料	float
  timestamp_closed: number; ///	クローズ日時	UNIX_TIMESTAMP
  price_avg: number; ///	建玉平均価格	float
  amount_done: number; ///	建玉数	float
  close_avg: number; ///	決済平均価格	float
  close_done: number; ///	決済数	float
  // deposit_xxx	実際にデポジットした額(xxxは通貨コード）	float
  // deposit_price_xxx	デポジット時計算レート(xxxは通貨コード）	float
  // refunded_xxx	実際に返却した額(xxxは通貨コード）	float
  // refunded_price_xxx	実際に返却した額(xxxは通貨コード）	float
  swap: number; ///	受け取ったスワップの額(AirFXのみ）	float
  guard_fee: number; ///	追証ガード手数料(信用取引のみ)	float
  [x: string]: any;
}

export interface PositionHistoryRequest {
  type: 'margin'|'futures'; ///	Yes	marginまたはfutures	str	 
  group_id?: number; ///	Yes/No	type=futuresの場合は必須	int	 
  leverage_id: number; ///	Yes	レバレッジ注文ID（get_positionsまたはactive_positionsで取得できます）	int
}

export interface PositionHistoryResponse {
  group_id: number; ///	グループID	int
  currency_pair: string; ///	通貨ペア	str
  action: 'bid'|'ask'; ///	bid(買い) or ask(売り)	str
  amount: number; ///	数量	float
  price: number; ///	価格	float
  timestamp: number; ///	発注日時	UNIX_TIMESTAMP
  your_action: 'bid'|'ask'|'both'; ///	bidまたはask、自己取引の場合はbothとなります	str
  bid_leverage_id: number; ///	買いレバレッジID(自分の注文の場合のみ)	int
  ask_leverage_id: number; ///	売りレバレッジID(自分の注文の場合のみ)	int
}

export interface ActivePositionRequest {
  type: 'margin'|'futures'; ///`	Yes	marginまたはfutures	str	 
  group_id?: number; ///	Yes/No	type=futuresの場合は必須	int	 
  currency_pair?: string; ///	No	通貨ペア。指定なしで全ての通貨ペア	(例) btc_jpy	全ペア
}

export interface ActivePositionResponse {
  group_id: number; ///	グループID	int
  currency_pair: string; ///	通貨ペア	str
  action: 'bid'|'ask'; ///	bid(買い) or ask(売り)	str
  amount: number; ///	数量	float
  price: number; ///	価格	float
  limit: number; ///	リミット価格	float
  stop: number; ///	ストップ価格	float
  timestamp: number; ///	発注日時	UNIX_TIMESTAMP
  term_end: number; ///	注文の有効期限	UNIX_TIMESTAMP
  leverage: number; ///	レバレッジ	float
  fee_spent: number; ///	支払い手数料	float
  price_avg: number; ///	建玉平均価格	float
  amount_done: number; ///	建玉数	float
  close_avg: number; ///	決済平均価格	float
  close_done: number; ///	決済数	float
  // deposit_xxx	実際にデポジットした額(xxxは通貨コード）	float
  // deposit_price_xxx	デポジット時計算レート(xxxは通貨コード）	float
  swap: number; ///	受け取ったスワップの額(AirFXのみ）	float
  [x: string]: any;
}

export interface CreatePositionRequest {
  type: 'margin'|'futures'; ///	Yes	marginまたはfutures	str
  group_id?: number; ///	Yes/No	type=futuresの場合は必須	int
  currency_pair: string; ///	Yes	(例) btc_jpy	str(例 btc_jpy)
  action: 'bid'|'ask'; ///	Yes	注文の種類	bid もしくは ask
  price: number; ///	Yes	指値注文価格	numerical
  amount: number; ///	Yes	数量(例: 0.3)	numerical
  leverage: number; ///	Yes	レバレッジ(小数点第2位まで有効）	numerical
  limit?: number; ///	No	リミット注文価格	numerical
  stop?: number; ///	No	ストップ注文価格	numerical
}

export interface CreatePositionResponse {
  leverage_id: number; ///	レバレッジID。	int
  timestamp: number; ///	注文日時	UNIX_TIMESTAMP
  term_end: number; ///	注文の有効期限	UNIX_TIMESTAMP
  price_avg: number; ///	平均建玉価格	float
  amount_done: number; ///	建玉数	float
  // deposit_xxx	実際にデポジットした額(xxxは通貨コード）	float
  // deposit_price_xxx	デポジット時計算レート(xxxは通貨コード）	float
  funds: {[currency: string]: number}; ///	残高	dict
  [x: string]: any;
}

export interface ChangePositionRequest {
  type: 'margin'|'futures'; ///	Yes	marginまたはfutures	str
  group_id?: number; ///	Yes/No	type=futuresの場合は必須	int
  leverage_id: number; ////	Yes	レバレッジ注文ID（get_positionsまたはactive_positionsで取得できます）	int
  price: number; ///	Yes	指値注文価格	numerical
  limit?: number; ///	No	リミット注文価格	numerical
  stop?: number; ///	No	ストップ注文価格	numerical
}

export interface ChangePositionResponse {
  leverage_id: number; ///	レバレッジID。	int
  timestamp_closed: number; ///	クローズ日時	UNIX_TIMESTAMP
  price_avg: number; ///	建玉平均価格	float
  amount_done: number; ///	建玉数	float
  close_avg: number; ///	決済平均価格	float
  close_done: number; ///	決済数	float
  // refunded_xxx	実際に返却した額(xxxは通貨コード）	float
  // refunded_price_xxx	実際に返却した額(xxxは通貨コード）	float
  swap: number; ///	受け取ったスワップの額(AirFXのみ）	float
  guard_fee: number; ///	追証ガード手数料(信用取引のみ)	float
  [x: string]: any; 
}

export interface CancelPositionRequest { 
  type: 'margin'|'futures'; ///	Yes	marginまたはfutures	str
  group_id?: number; ///	Yes/No	type=futuresの場合は必須	int
  leverage_id: number; ///	Yes	レバレッジ注文ID（get_positionsまたはactive_positionsで取得できます）	int
}

export interface CancelPositionResponse {
  leverage_id: number; ///	レバレッジID	int
  fee_spent: number; ///	支払い手数料	float
  timestamp_closed: number; ///	クローズ日時	UNIX_TIMESTAMP
  price_avg: number; ///	建玉平均価格	float
  amount_done: number; ///	建玉数	float
  close_avg: number; ///	決済平均価格	float
  close_done: number; ///	決済数	float
  // refunded_xxx	実際に返却した額(xxxは通貨コード）	float
  // refunded_price_xxx	実際に返却した額(xxxは通貨コード）	float
  [x: string]: any;
  swap: number; ///	受け取ったスワップの額(AirFXのみ）	float
  guard_fee: number; ///	追証ガード手数料(信用取引のみ)	float
  funds: {[currency: string]: number}; ///	残高	dict
}
