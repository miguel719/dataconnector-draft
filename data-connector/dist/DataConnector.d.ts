export interface EndpointConfig {
    url: string;
    method: string;
    headers?: HeadersInit;
}
export interface Config {
    [key: string]: any;
}
export declare class DataConnector {
    config: Config;
    endpoints: Record<string, EndpointConfig>;
    defaultHeaders: HeadersInit;
    constructor();
    initEndpoints(options?: Record<string, unknown>): Record<string, EndpointConfig>;
    initConfig(): Config;
    setConfig(newConfig: Partial<Config>): void;
    getConfig(): Config;
    apiCall(endpointKey: string, body?: any, queryParams?: Record<string, any>): Promise<any>;
    getDefaultHeaders(): HeadersInit;
    setDefaultHeaders(newHeaders: HeadersInit): void;
    emitEvent(eventName: string, detail: any): void;
    errorHandler(error: any): void;
}
