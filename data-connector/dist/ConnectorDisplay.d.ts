import { LitElement, CSSResult, PropertyValues, TemplateResult } from "lit";
import { DataConnector } from "./DataConnector";
interface EndpointConfig {
    method: string;
    url: string;
    sample_request_data?: unknown;
}
interface ResponseData {
    [key: string]: unknown;
}
export declare class ConnectorDisplay extends LitElement {
    static styles: CSSResult;
    static get properties(): {
        connector: {
            type: ObjectConstructor;
        };
        responseData: {
            type: ObjectConstructor;
        };
    };
    connector: DataConnector;
    responseData: ResponseData;
    constructor();
    renderEndpoint(key: string, config: EndpointConfig): TemplateResult;
    handleApiCall(key: string, config: EndpointConfig): Promise<void>;
    render(): TemplateResult;
    protected willUpdate(_changedProperties: PropertyValues): void;
}
export {};
