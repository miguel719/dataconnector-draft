import { DataConnector } from "../src/DataConnector";
import { runServer, closeServer } from "./server-test";

describe("DataConnector", () => {
  let dataConnector: DataConnector;

  // Initial data connector class
  class dataConnectorTest extends DataConnector {
    initConfig() {
      return {
        API_URL: "http://localhost:2000",
        JWT: "initial_token",
      };
    }

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
  }

  // Create a new instance of data connector
  beforeAll(async () => {
    dataConnector = new dataConnectorTest();
    await runServer();
  });

  // Test case for configuration initialization
  test("should initialize with the given configuration", () => {
    console.log("test1");
    const initialConfig = dataConnector.getConfig();
    expect(initialConfig).toEqual({
      API_URL: "http://localhost:2000",
      JWT: "initial_token",
    });
  });

  // Test case for setting new configuration
  test("should update configuration", () => {
    console.log("test2");
    dataConnector.setConfig({ API_URL: "http://localhost:31245" });
    expect(dataConnector.getConfig()).toHaveProperty(
      "API_URL",
      "http://localhost:31245"
    );
  });

  // Test case for create tasks
  let taskId: string;
  test("should create tasks", async () => {
    const taskData = {
      task: "Buy groceries",
      status: "pending",
    };
    const task = await dataConnector.apiCall("create_task", taskData);
    taskId = task._id;
    expect(task).toHaveProperty("date");
    expect(task).toHaveProperty("task", taskData.task);
    expect(task).toHaveProperty("status", taskData.status);
  });

  // Test case for getting tasks
  test("should get tasks", async () => {
    const tasks = await dataConnector.apiCall("get_tasks");
    expect(Array.isArray(tasks)).toBe(true);
  });

  // Test case for updating a task
  test("should update a task", async () => {
    const updatedData = { task: "Updated Task", status: "completed" };
    const updatedMessage = await dataConnector.apiCall(
      "update_task",
      updatedData,
      { id: taskId }
    );

    expect(updatedMessage).toEqual({ message: "Task updated successfully" });
  });

  // Test case for deleting a task
  test("should delete a task", async () => {
    const deletedMessage = await dataConnector.apiCall("delete_task", null, {
      id: taskId,
    });

    expect(deletedMessage).toEqual({ message: "Task deleted successfully" });
  });

  afterAll(async () => {
    await closeServer();
  });
});
