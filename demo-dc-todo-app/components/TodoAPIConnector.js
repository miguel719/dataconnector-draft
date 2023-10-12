import { DataConnector } from "data-connector";

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
      create_task: {
        method: "POST",
        url: this.config.API_URL + "/tasks",
        sample_request_data: { task: "Shopping", status: "pending" },
      },
      get_tasks: { method: "GET", url: this.config.API_URL + "/tasks" },
      update_task: {
        method: "PUT",
        url: this.config.API_URL + "/tasks/{id}",
        sample_request_data: { task: "Shopping", status: "pending" },
      },
      delete_task: {
        method: "DELETE",
        url: this.config.API_URL + "/tasks/{id}",
      },
    };
  }

  // STATES
  stateEvent = "state_update"; // optional to trigger event on state change
  initState() {
    return {
      tasks: [],
      test: { default: "test1", type: String },
    };
  }

  // METHODS
  async fetchAllTasks() {
    const tasks = await this.apiCall("get_tasks");
    this.setState({ tasks, test: "[1]" });
  }

  async createTask(taskData) {
    await this.apiCall("create_task", taskData);
    await this.fetchAllTasks();
  }

  async updateTask(taskId, updatedData) {
    await this.apiCall("update_task", updatedData, { id: taskId });
    await this.fetchAllTasks();
  }

  async deleteTask(taskId) {
    await this.apiCall("delete_task", null, { id: taskId });
    await this.fetchAllTasks();
  }

  errorHandler(error) {
    super.errorHandler(error);
    // logic to handle error
  }
}

const todoAPI = new TodoAPIConnector();
todoAPI.setConfig({
  API_URL: "http://localhost:3005",
});

export default todoAPI;
