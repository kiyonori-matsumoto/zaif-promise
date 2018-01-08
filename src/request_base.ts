import * as qs from 'qs';
import * as crypto from 'crypto';
import * as rp from 'request-promise-native';
import { Config } from './config';

const AsyncLock = require('async-lock');

const lock = new AsyncLock();

export class RequestBase {
  
  private static timestamp = Date.now() / 1000.0;
  
  private key = process.env.ZAIF_KEY || '';
  private secret = process.env.ZAIF_SECRET || '';
  private endpoint = '';

  public constructor(endpoint: string, key?: string, secret?:string) {
    if(key) { this.key = key }
    if(secret) { this.secret = secret }
    this.endpoint = endpoint;
  }

  public set_credentials(_key: string, _secret: string) {
    this.key = _key;
    this.secret = _secret;
  }

  protected build_options(method: string, query: any) {
    RequestBase.timestamp = RequestBase.timestamp + 0.001;

    const body = {
      nonce: RequestBase.timestamp,
      method: method,
    }

    const form = qs.stringify(Object.assign({}, body, query));
    const sign = crypto.createHmac('sha512', this.secret).update(form).digest('hex');

    const options = {
      url: Config.endpoint + this.endpoint,
      method: 'POST',
      headers: {
        Key: this.key,
        Sign: sign,
      },
      body: form
    };
    return options;
  }

  protected send_request(method: string, query: any = {}) {
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
}
