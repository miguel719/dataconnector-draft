import { DataConnector, EndpointConfig, Config } from "./DataConnector";
import { ReflectionService } from "./ReflectionService";

class TodoAPIConnector extends DataConnector {
  reflectionService: ReflectionService;

  constructor() {
    super();
    this.reflectionService = new ReflectionService();
    this.initTodoEndpoints();
  }

  initConfig(): Config {
    return {
      API_URL: "http://localhost:3000",
    };
  }

  initEndpoints(): Record<string, EndpointConfig> {
    return {};
  }

  initTodoEndpoints() {
    this.reflectionService.addEndpoint(this, "getTodos", {
      method: "GET",
      url: `${this.config.API_URL}/todos`,
    });

    this.reflectionService.addEndpoint(this, "createTodo", {
      method: "POST",
      url: `${this.config.API_URL}/todos`,
    }, { description: "Create a new todo item" });

    this.reflectionService.addEndpoint(this, "updateTodo", {
      method: "PUT",
      url: `${this.config.API_URL}/todos/{id}`,
    });

    this.reflectionService.addEndpoint(this, "deleteTodo", {
      method: "DELETE",
      url: `${this.config.API_URL}/todos/{id}`,
    });
  }

  async getTodos() {
    return this.apiCall("getTodos");
  }

  async createTodo(todo: { title: string; completed: boolean }) {
    return this.apiCall("createTodo", todo);
  }

  async updateTodo(id: string, todo: { title: string; completed: boolean }) {
    return this.apiCall("updateTodo", todo, { id });
  }

  async deleteTodo(id: string) {
    return this.apiCall("deleteTodo", null, { id });
  }
}

export default TodoAPIConnector;
