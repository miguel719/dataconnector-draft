/*
- Add config constructor
- Add states, get state and set state
- Update events for state changes
- Update event for api call
- Documents and upload
*/

export class DataConnector {
  constructor() {
    this.config = { ...this.initConfig() };
    this.endpoints = { ...this.initEndpoints() };
    this.states = { ...this.initStates() };
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }
  initEndpoints() {
    return {};
  }

  // STATES
  initStates() {
    return {};
  }

  setStates(newStates) {
    this.states = { ...this.states, ...newStates };
    return $this.states;
  }

  getStates() {
    return { ...this.states };
  }

  // CONFIG METHODS
  initConfig() {
    return {};
  }

  setConfig(newConfig) {
    console.log("set config");
    for (const [key, value] of Object.entries(newConfig)) {
      if (this.config.hasOwnProperty(key)) {
        this.config[key] = value;
      }
    }
    this.endpoints = this.initEndpoints();
  }

  getConfig() {
    return { ...this.config };
  }

  // APICALL HANDLER
  async apiCall(endpointKey, body = null, queryParams = {}) {
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

    // Emit events to connected web components
    this.emitEvent(endpointKey + "_res", { data, url });

    return data;
  }

  getDefaultHeaders() {
    return this.defaultHeaders;
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
}
