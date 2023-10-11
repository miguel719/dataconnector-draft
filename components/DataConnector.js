/*
TODO
BASE
- Add endpoints sample data and documentation

UI
- Allow display config and state as table editable
- Allow display endpoints and make request and display response
*/

export class DataConnector {
  stateEvent = "";
  constructor() {
    this.config = { ...this.initConfig() };
    this.endpoints = { ...this.initEndpoints() };
    this.state = { ...this.getInitialState() };
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }
  initEndpoints(options = {}) {
    return {};
  }

  // STATE METHODS
  initState() {
    return {};
  }

  setState(newState) {
    try {
      //Validate values
      const inisitalState = this.initState();
      for (const [key, value] of Object.entries(newState)) {
        if (inisitalState[key] && inisitalState[key].type) {
          validateType(value, inisitalState[key].type);
        }
      }

      if (this.stateEvent) {
        const changes = getDifferences(this.state, {
          ...this.state,
          ...newState,
        });
        this.emitEvent(this.stateEvent, changes);
      }
      this.state = { ...this.state, ...newState };
      return this.state;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  getInitialState() {
    const initialState = this.initState();
    const realState = {};
    for (const [key, value] of Object.entries(initialState)) {
      realState[key] = value.default ? value.default : value;
    }
    return realState;
  }

  getState() {
    return { ...this.state };
  }

  // CONFIG METHODS
  initConfig() {
    return {};
  }

  setConfig(newConfig) {
    const initialConfig = this.initConfig();
    for (const [key, value] of Object.entries(newConfig)) {
      if (initialConfig[key] && initialConfig[key].type) {
        validateType(value, initialConfig[key].type);
      }
    }

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

      // Emit events to connected web components
      this.emitEvent(endpointKey + "_res", { data, url });

      return data;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  // HEADERS HANDLERS
  getDefaultHeaders() {
    return this.defaultHeaders;
  }

  setDefaultHeaders(newHeaders) {
    this.defaultHeaders = { ...newHeaders };
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

// HELPERS
function getDifferences(obj1, obj2) {
  let prevState = {};
  let state = {};

  for (let key in obj1) {
    if (!(key in obj2)) {
      prevState[key] = obj1[key];
      state[key] = undefined;
    } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
      prevState[key] = obj1[key];
      state[key] = obj2[key];
    }
  }

  for (let key in obj2) {
    if (!(key in obj1)) {
      prevState[key] = undefined;
      state[key] = obj2[key];
    }
  }

  return { prevState, state };
}

function validateType(value, expectedType) {
  if (expectedType === String && typeof value !== "string") {
    throw new Error(`Expected type String, but received type ${typeof value}`);
  } else if (expectedType === Number && typeof value !== "number") {
    throw new Error(`Expected type Number, but received type ${typeof value}`);
  } else if (expectedType === Boolean && typeof value !== "boolean") {
    throw new Error(`Expected type Boolean, but received type ${typeof value}`);
  } else if (expectedType === Array && !Array.isArray(value)) {
    throw new Error(`Expected type Array, but received type ${typeof value}`);
  } else if (typeof value === "object" && !(value instanceof expectedType)) {
    throw new Error(
      `Expected type ${expectedType.name}, but received type ${typeof value}`
    );
  }
}
