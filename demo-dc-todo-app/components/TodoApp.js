import { LitElement, html, css } from "lit";
import "./TodoInput.js";
import "./TodoList.js";

export class TodoApp extends LitElement {
  render() {
    return html`
      <h2>TODO APP</h2>
      <todo-input></todo-input>
      <todo-list></todo-list>
    `;
  }
}

customElements.define("todo-app", TodoApp);
