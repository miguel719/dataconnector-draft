import { LitElement, html, css } from "lit";
import { DataConnector } from "./DataConnector";

export class ConnectorDisplay extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 30px;
    }
    .container {
      display: flex;
      justify-content: space-between;
    }
    .endpoint {
      flex-basis: 35%;
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 10px;
    }
    .response {
      flex-basis: 65%;
      margin-top: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      background-color: #f6f8fa;
    }
    textarea,
    input,
    button {
      display: block;
      width: 100%;
      margin-bottom: 10px;
    }
    textarea {
      height: 150px;
      resize: vertical;
    }
  `;

  static properties = {
    connector: { type: Object },
    responseData: { type: Object },
  };

  constructor() {
    super();
    this.connector = new DataConnector(); // Or you can set it from outside
    this.responseData = {};
  }

  renderEndpoint(key, config) {
    const sampleRequestData = config.sample_request_data
      ? JSON.stringify(config.sample_request_data, null, 2)
      : "";

    // Extract placeholders from the URL
    const urlPlaceholders = config.url.match(/{\w+}/g) || [];

    return html`
      <div class="container">
        <div class="endpoint">
          <h3>${key.toUpperCase()} - ${config.method} ${config.url}</h3>
          ${config.method === "POST" || config.method === "PUT"
            ? html`
                <textarea
                  id="${key}-body"
                  placeholder="Request body JSON"
                  .value=${sampleRequestData}
                ></textarea>
              `
            : ""}
          ${urlPlaceholders.map((placeholder) => {
            const placeholderKey = placeholder.replace(/[{}]/g, ""); // Remove the curly braces for the input id
            return html`
              <input
                id="${key}-${placeholderKey}"
                type="text"
                placeholder=${placeholder}
              />
            `;
          })}
          <button @click="${() => this.handleApiCall(key, config)}">
            Send Request
          </button>
        </div>
        ${this.responseData[key]
          ? html`
              <div class="response">
                <h4>Response:</h4>
                <pre>${JSON.stringify(this.responseData[key], null, 2)}</pre>
              </div>
            `
          : ""}
      </div>
    `;
  }

  async handleApiCall(key, config) {
    let body = null;
    const queryParams = {};

    if (config.method === "POST" || config.method === "PUT") {
      const textarea = this.shadowRoot.getElementById(`${key}-body`);
      body = textarea?.value ? JSON.parse(textarea.value) : null;
    }

    const urlPlaceholders = config.url.match(/{\w+}/g) || [];
    urlPlaceholders.forEach((placeholder) => {
      const placeholderKey = placeholder.replace(/[{}]/g, "");
      const input = this.shadowRoot.querySelector(
        `input[placeholder="${placeholder}"]`
      );
      if (input && input.value) {
        queryParams[placeholderKey] = input.value;
      } else {
        throw new Error(`Value for URL placeholder ${placeholder} is missing`);
      }
    });

    try {
      const response = await this.connector.apiCall(key, body, queryParams); // Pass queryParams here
      this.responseData = { ...this.responseData, [key]: response };
      this.requestUpdate();
    } catch (error) {
      console.error("API call failed:", error);
    }
  }

  render() {
    const endpoints = this.connector.initEndpoints();

    return html`
      ${Object.keys(endpoints).map((key) =>
        this.renderEndpoint(key, endpoints[key])
      )}
    `;
  }
}

customElements.define("connector-display", ConnectorDisplay);
