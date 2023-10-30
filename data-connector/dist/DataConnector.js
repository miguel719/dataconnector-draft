var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class DataConnector {
    constructor() {
        this.config = Object.assign({}, this.initConfig());
        this.endpoints = Object.assign({}, this.initEndpoints());
        this.defaultHeaders = {
            "Content-Type": "application/json",
        };
    }
    initEndpoints(options = {}) {
        return {};
    }
    // CONFIG METHODS
    initConfig() {
        return {};
    }
    setConfig(newConfig) {
        // Check if newConfig has all the required properties
        for (const [key, value] of Object.entries(newConfig)) {
            if (this.config.hasOwnProperty(key)) {
                this.config[key] = value;
            }
        }
        this.endpoints = this.initEndpoints();
    }
    getConfig() {
        return Object.assign({}, this.config);
    }
    // APICALL HANDLER
    apiCall(endpointKey, body = null, queryParams = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.endpoints[endpointKey]) {
                    console.error(`Endpoint ${endpointKey} not configured.`);
                    return;
                }
                const endpointConfig = this.endpoints[endpointKey];
                let url = endpointConfig.url;
                // Replace URL placeholders with actual values from queryParams
                for (const [key, value] of Object.entries(queryParams)) {
                    url = url.replace(`{${key}}`, value);
                }
                // Append query parameters for GET requests
                if (endpointConfig.method === "GET" && Object.keys(queryParams).length) {
                    const queryString = new URLSearchParams(queryParams).toString();
                    url += `?${queryString}`;
                }
                const response = yield fetch(url, {
                    method: endpointConfig.method,
                    headers: endpointConfig.headers
                        ? endpointConfig.headers
                        : this.getDefaultHeaders(),
                    body: body && endpointConfig.method !== "GET" ? JSON.stringify(body) : null,
                });
                const data = yield response.json();
                // Emit events to connected web components
                this.emitEvent(endpointKey + "_res", { data, url });
                return data;
            }
            catch (error) {
                this.errorHandler(error);
            }
        });
    }
    // HEADERS HANDLERS
    getDefaultHeaders() {
        return this.defaultHeaders;
    }
    setDefaultHeaders(newHeaders) {
        this.defaultHeaders = Object.assign({}, newHeaders);
    }
    // EMIT CUSTOM EVENTS
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
            detail: detail,
        });
        document.dispatchEvent(event);
    }
    // ERROR HANDLERS
    errorHandler(error) {
        console.error("DataConnector error:", error);
    }
}
