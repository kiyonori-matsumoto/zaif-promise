import {V2Private} from './privatev2';
import {Public} from './public';
import {Leverage} from './leverage';

export class Zaif {
  public readonly Private: V2Private;
  public readonly Public = Public;
  public readonly Leverage: Leverage;

  constructor(key?: string, secret?: string) {
    this.Private = new V2Private(key, secret)
    this.Leverage = new Leverage(key, secret);
  }

  public set_credentials(_key: string, _secret: string) {
    this.Private.set_credentials(_key, _secret);
    this.Leverage.set_credentials(_key, _secret);
  }
}
