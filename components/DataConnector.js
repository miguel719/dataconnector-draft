import {LitElement, html, css} from 'lit';

export class DataConnector extends LitElement {
  constructor() {
    super();
    this.endpoints = {};
    this.config = {};
    this.responseData = {};
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // CONFIG METHOS
  setConfig(newConfig) {
    for (const [key, value] of Object.entries(newConfig)) {
      if (this.config.hasOwnProperty(key)) {
        this.config[key] = value;
      }
    }
  }

  getConfig() {
    return this.config;
  }

  // APICALL HANDLER
  async apiCall(endpointKey, body = null, queryParams = {}) {
    if (!this.endpoints[endpointKey]) {
      console.error(`Endpoint ${endpointKey} not configured.`);
      return;
    }

    const endpointConfig = this.endpoints[endpointKey];
    // const headers = this.getHeaders();

    let url = endpointConfig.url;

    // Replace URL placeholders with actual values from queryParams
    for (const [key, value] of Object.entries(queryParams)) {
      url = url.replace(`{${key}}`, value);
    }

    // Append query parameters for GET requests
    if (endpointConfig.method === 'GET' && Object.keys(queryParams).length) {
      const queryString = new URLSearchParams(queryParams).toString();
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      method: endpointConfig.method,
      headers: endpointConfig.headers
        ? endpointConfig.headers
        : this.getDefaultHeaders(),
      body:
        body && endpointConfig.method !== 'GET' ? JSON.stringify(body) : null,
    });

    const data = await response.json();
    this.processDataForUI(data, endpointKey);

    const event = {
      bubbles: true,
      cancelable: true,
      detail: {data, url},
    };
    this.dispatchEvent(new CustomEvent('api-response', event));
    this.dispatchEvent(new CustomEvent(endpointKey + '-response', event));

    return data;
  }

  getDefaultHeaders() {
    return this.defaultHeaders;
  }

  processDataForUI(data, endpointKey) {
    this.responseData[endpointKey] = data;
    this.requestUpdate();
  }

  // RENDER SLOT
  render() {
    return html` <slot .data=${this.responseData}></slot> `;
  }
}
