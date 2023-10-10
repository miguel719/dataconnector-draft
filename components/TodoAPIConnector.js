import { DataConnector } from "./DataConnector";

class TodoAPIConnector extends DataConnector {
  // CONFIGURATION
  initConfig() {
    return {
      API_URL: "http://localhost:2000",
      JWT: "initial_token",
    };
  }

  // ENDPOINTS
  initEndpoints() {
    return {
      create_task: { method: "POST", url: this.config.API_URL + "/tasks" },
      update_task: {
        method: "PUT",
        url: this.config.API_URL + "/tasks/{id}",
      },
      get_tasks: { method: "GET", url: this.config.API_URL + "/tasks" },
      delete_task: {
        method: "DELETE",
        url: this.config.API_URL + "/tasks/{id}",
      },
    };
  }

  // STATES
  initStates() {
    return {
      tasks: [],
    };
  }

  // METHODS
  async fetchAllTasks() {
    this.tasks = await this.apiCall("get_tasks");
  }

  async createTask(taskData) {
    await this.apiCall("create_task", taskData);
  }

  async updateTask(taskId, updatedData) {
    await this.apiCall("update_task", updatedData, { id: taskId });
  }

  async deleteTask(taskId) {
    await this.apiCall("delete_task", null, { id: taskId });
  }
}

const todoAPI = new TodoAPIConnector();
todoAPI.setConfig({
  API_URL: "http://localhost:3005",
});

export default todoAPI;
