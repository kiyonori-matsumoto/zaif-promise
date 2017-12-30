export declare class RequestBase {
    private key;
    private secret;
    private timestamp;
    private endpoint;
    constructor(endpoint: string, key?: string, secret?: string);
    set_credentials(_key: string, _secret: string): void;
    protected build_options(method: string, query: any): {
        url: string;
        method: string;
        headers: {
            Key: string;
            Sign: string;
        };
        body: string;
    };
    protected send_request(method: string, query?: any): any;
}
