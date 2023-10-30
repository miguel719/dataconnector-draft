export interface EndpointConfig {
  url: string;
  method: string;
  headers?: HeadersInit;
}

export interface Config {
  [key: string]: any;
}

export class DataConnector {
  config: Config;
  endpoints: Record<string, EndpointConfig>;
  defaultHeaders: HeadersInit;

  constructor() {
    this.config = { ...this.initConfig() };
    this.endpoints = { ...this.initEndpoints() };
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  initEndpoints(
    options: Record<string, unknown> = {}
  ): Record<string, EndpointConfig> {
    return {};
  }

  // CONFIG METHODS
  initConfig(): Config {
    return {};
  }

  setConfig(newConfig: Partial<Config>): void {
    // Check if newConfig has all the required properties
    for (const [key, value] of Object.entries(newConfig)) {
      if (this.config.hasOwnProperty(key)) {
        this.config[key] = value;
      }
    }
    this.endpoints = this.initEndpoints();
  }

  getConfig(): Config {
    return { ...this.config };
  }

  // APICALL HANDLER
  async apiCall(
    endpointKey: string,
    body: any = null,
    queryParams: Record<string, any> = {}
  ): Promise<any> {
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

      const response = await fetch(url, {
        method: endpointConfig.method,
        headers: endpointConfig.headers
          ? endpointConfig.headers
          : this.getDefaultHeaders(),
        body:
          body && endpointConfig.method !== "GET" ? JSON.stringify(body) : null,
      });

      const data = await response.json();
      const statusCode = response.status;

      // Emit custom event
      this.emitEvent(endpointKey + "_res", { data, url, statusCode });

      return { data, url, statusCode };
    } catch (error) {
      this.errorHandler(error);
    }
  }

  // HEADERS HANDLERS
  getDefaultHeaders(): HeadersInit {
    return this.defaultHeaders;
  }

  setDefaultHeaders(newHeaders: HeadersInit): void {
    this.defaultHeaders = { ...newHeaders };
  }

  // EMIT CUSTOM EVENTS
  emitEvent(eventName: string, detail: any): void {
    if (typeof CustomEvent === "function") {
      const event = new CustomEvent(eventName, {
        bubbles: true,
        cancelable: true,
        detail: detail,
      });
      document.dispatchEvent(event);
    }
  }

  // ERROR HANDLERS
  errorHandler(error: any): void {
    console.error("DataConnector error:", error);
  }
}
