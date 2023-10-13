import {
  LitElement,
  html,
  css,
  CSSResult,
  PropertyValues,
  TemplateResult,
} from "lit";

import { DataConnector } from "./DataConnector";

interface EndpointConfig {
  method: string;
  url: string;
  sample_request_data?: unknown; // Define a more specific type if you know the structure of 'sample_request_data'
}

interface ResponseData {
  [key: string]: unknown; // Define a more specific type if you know the structure of the response data
}

export class ConnectorDisplay extends LitElement {
  static styles: CSSResult = css`
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

  static get properties() {
    return {
      connector: { type: Object },
      responseData: { type: Object },
    };
  }

  connector: DataConnector;
  responseData: ResponseData;

  constructor() {
    super();
    this.connector = new DataConnector();
    this.responseData = {};
  }

  renderEndpoint(key: string, config: EndpointConfig): TemplateResult {
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

  async handleApiCall(key: string, config: EndpointConfig): Promise<void> {
    let body = null;
    const queryParams: Record<string, string> = {};

    if (config.method === "POST" || config.method === "PUT") {
      const textarea = this.shadowRoot?.getElementById(
        `${key}-body`
      ) as HTMLTextAreaElement | null;
      body = textarea?.value ? JSON.parse(textarea.value) : null;
    }

    const urlPlaceholders = config.url.match(/{\w+}/g) || [];
    urlPlaceholders.forEach((placeholder) => {
      const placeholderKey = placeholder.replace(/[{}]/g, "");
      const input = this.shadowRoot?.querySelector(
        `input[placeholder="${placeholder}"]`
      ) as HTMLTextAreaElement | null;
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

  render(): TemplateResult {
    const endpoints: Record<string, EndpointConfig> =
      this.connector.initEndpoints();

    return html`
      <p>Test</p>
      ${Object.keys(endpoints).map((key) =>
        this.renderEndpoint(key, endpoints[key])
      )}
    `;
  }

  protected willUpdate(_changedProperties: PropertyValues): void {
    console.log("willUpdate");
    console.log(_changedProperties);
    super.willUpdate(_changedProperties);
  }
}

customElements.define("connector-display", ConnectorDisplay);
