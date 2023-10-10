import { LitElement, html, css } from "lit";
import todoAPI from "./TodoAPIConnector";

export class TodoInput extends LitElement {
  static styles = css`
    .container {
      display: flex;
      gap: 10px;
      padding: 10px;
      border-bottom: 1px solid #ccc;
      align-items: center;
    }

    input[type="text"] {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 8px 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #0056b3;
    }
  `;

  static properties = {
    taskName: { type: String },
  };

  constructor() {
    super();
    this.taskName = "";
  }

  handleInputChange(event) {
    this.taskName = event.target.value;
  }

  async handleButtonClick() {
    if (this.taskName.trim() === "") return;
    await todoAPI.createTask({ task: this.taskName });
    this.taskName = ""; // Clear the input after adding the task
  }

  render() {
    return html`
      <div class="container">
        <input
          type="text"
          .value=${this.taskName}
          @input=${this.handleInputChange}
          placeholder="Enter task name"
        />
        <button @click=${this.handleButtonClick}>Add Task</button>
      </div>
    `;
  }
}

customElements.define("todo-input", TodoInput);
