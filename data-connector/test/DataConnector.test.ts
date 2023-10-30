import { DataConnector } from "../src/DataConnector";
import { ReflectionService } from "../src/ReflectionService";
import { runServer, closeServer } from "./server-test";

describe("DataConnector", () => {
  let dataConnector: DataConnector;
  let reflectionService: ReflectionService;

  // Initial data connector class
  class DataConnectorTest extends DataConnector {
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
    console.log("before all");
    dataConnector = new DataConnectorTest();
    reflectionService = new ReflectionService();
    await runServer();
  }, 10000);

  // Test case for configuration initialization
  test("should initialize with the given configuration", () => {
    const initialConfig = dataConnector.getConfig();
    expect(initialConfig).toEqual({
      API_URL: "http://localhost:2000",
      JWT: "initial_token",
    });
  });

  // Test case for setting new configuration
  test("should update configuration", () => {
    dataConnector.setConfig({ API_URL: "http://localhost:31245" });
    expect(dataConnector.getConfig()).toHaveProperty(
      "API_URL",
      "http://localhost:31245"
    );
  });

  // Test case for reflection service - getting all properties
  test("should get all properties using reflection", () => {
    const properties = reflectionService.getAllProperties(dataConnector);
    expect(properties).toContain("config");
    expect(properties).toContain("endpoints");
    expect(properties).toContain("defaultHeaders");
  });

  // Test case for reflection service - getting data properties
  test("should get data properties using reflection", () => {
    const dataProperties = reflectionService.getDataProperties(dataConnector);
    expect(dataProperties).toHaveProperty("config");
    expect(dataProperties).toHaveProperty("endpoints");
    expect(dataProperties).toHaveProperty("defaultHeaders");
  });

  // Test case for reflection service - getting methods
  test("should get methods using reflection", () => {
    const methods = reflectionService.getMethods(dataConnector);
    expect(methods).toHaveProperty("apiCall");
    expect(methods).toHaveProperty("setConfig");
    expect(methods).toHaveProperty("getConfig");
  });

  // Test case for reflection service - adding endpoint
  test("should add endpoint using reflection", () => {
    const newEndpoint = {
      method: "GET",
      url: "http://localhost:2000/new-endpoint",
    };
    reflectionService.addEndpoint(dataConnector, "new_endpoint", newEndpoint);
    expect(dataConnector.endpoints).toHaveProperty("new_endpoint", newEndpoint);
  });

  // Test case for reflection service - editing endpoint
  test("should edit endpoint using reflection", () => {
    const updatedEndpoint = {
      url: "http://localhost:2000/updated-endpoint",
    };
    reflectionService.editEndpoint(
      dataConnector,
      "new_endpoint",
      updatedEndpoint
    );
    expect(dataConnector.endpoints.new_endpoint.url).toBe(
      "http://localhost:2000/updated-endpoint"
    );
  });

  // Test case for reflection service - getting endpoint metadata
  test("should get endpoint metadata using reflection", () => {
    const metadata = { description: "This is a new endpoint" };
    reflectionService.addEndpoint(
      dataConnector,
      "metadata_endpoint",
      { method: "GET", url: "http://localhost:2000/metadata-endpoint" },
      metadata
    );
    const retrievedMetadata = reflectionService.getEndpointMetadata(
      dataConnector,
      "metadata_endpoint"
    );
    expect(retrievedMetadata).toEqual(metadata);
  });

  // Test case for reflection service - adding config property
  test("should add config property using reflection", () => {
    reflectionService.addConfigProperty(
      dataConnector,
      "newConfigProperty",
      "newValue"
    );
    expect(dataConnector.config).toHaveProperty(
      "newConfigProperty",
      "newValue"
    );
  });

  // Test case for reflection service - editing config property
  test("should edit config property using reflection", () => {
    reflectionService.editConfigProperty(
      dataConnector,
      "newConfigProperty",
      "updatedValue"
    );
    expect(dataConnector.config.newConfigProperty).toBe("updatedValue");
  });

  // Test case for reflection service - getting config property metadata
  test("should get config property metadata using reflection", () => {
    const metadata = { description: "This is a new config property" };
    reflectionService.addConfigProperty(
      dataConnector,
      "metadataConfigProperty",
      "metadataValue",
      metadata
    );
    const retrievedMetadata = reflectionService.getConfigPropertyMetadata(
      dataConnector,
      "metadataConfigProperty"
    );
    expect(retrievedMetadata).toEqual(metadata);
  });

  // Test case for create tasks
  let taskId: string;
  test("should create tasks", async () => {
    const taskData = {
      task: "Buy groceries",
      status: "pending",
    };
    let task = await dataConnector.apiCall("create_task", taskData);
    task = task.data;
    taskId = task._id;
    expect(task).toHaveProperty("date");
    expect(task).toHaveProperty("task", taskData.task);
    expect(task).toHaveProperty("status", taskData.status);
  });

  // Test case for getting tasks
  test("should get tasks", async () => {
    const tasks = await dataConnector.apiCall("get_tasks");
    expect(Array.isArray(tasks.data)).toBe(true);
  });

  // Test case for updating a task
  test("should update a task", async () => {
    const updatedData = { task: "Updated Task", status: "completed" };
    const updatedMessage = await dataConnector.apiCall(
      "update_task",
      updatedData,
      { id: taskId }
    );

    expect(updatedMessage.data).toEqual({
      message: "Task updated successfully",
    });
  });

  // Test case for deleting a task
  test("should delete a task", async () => {
    const deletedMessage = await dataConnector.apiCall("delete_task", null, {
      id: taskId,
    });

    expect(deletedMessage.data).toEqual({
      message: "Task deleted successfully",
    });
  });

  afterAll(async () => {
    console.log("after all");
    await closeServer();
  });
});
