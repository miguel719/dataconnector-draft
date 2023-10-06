import { html } from "lit";
import { DataConnector } from "./DataConnector";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";

export class TodoAPIConnector extends DataConnector {
  // CONFIGURATIION
  config = {
    API_URL: "http://localhost:3005", // Base URL for the Todo API
    JWT: "initial_token", // JWT token for authentication
  };

  // ENDPOINTS
  endpoints = {
    createTask: { method: "POST", url: this.config.API_URL + "/tasks" },
    updateTaskById: { method: "PUT", url: this.config.API_URL + "/tasks/{id}" },
    getAllTasks: { method: "GET", url: this.config.API_URL + "/tasks" },
    deleteTaskById: {
      method: "DELETE",
      url: this.config.API_URL + "/tasks/{id}",
    },
  };

  // PROPERTIES
  static properties = {
    tasks: { type: Array },
  };

  constructor() {
    super();
    this.tasks = [];
  }

  // METHODS
  firstUpdated() {
    this.fetchAllTasks();
  }

  async fetchAllTasks() {
    this.tasks = await this.apiCall("getAllTasks");
  }

  async createTask(taskData) {
    await this.apiCall("createTask", taskData);
    this.fetchAllTasks();
  }

  async updateTask(taskId, updatedData) {
    await this.apiCall("updateTaskById", updatedData, { id: taskId });
    this.fetchAllTasks();
  }

  async deleteTask(taskId) {
    await this.apiCall("deleteTaskById", null, { id: taskId });
    this.fetchAllTasks();
  }

  // RENDER AND PASS DATA AND METHODS TO CHILDREN
  render() {
    return html`
      <h2>Todo App</h2>
      <todo-input .createTask=${this.createTask.bind(this)}></todo-input>
      <todo-list
        .tasks=${this.tasks}
        .updateTask=${this.updateTask.bind(this)}
        .deleteTask=${this.deleteTask.bind(this)}
      ></todo-list>
    `;
  }
}

customElements.define("dc-todo-api", TodoAPIConnector);
