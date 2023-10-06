# DataConnector WOP

## Install and start

```javascript
npm install
npm start
```

## Creating new Data Connector

This a basic general example of DataConnector

```javascript
export class TodoAPIConnector extends DataConnector {
  // CONFIGURATIION: You can add any configurations props here
  config = {
    API_URL: 'http://localhost:3005', // Base URL for the Todo API
    JWT: 'initial_token', // JWT token for authentication
  };

  // ENDPOINTS: this endpoint will be available to consume from methods
  endpoints = {
    createTask: {method: 'POST', url: this.config.API_URL + '/tasks'},
    getAllTasks: {method: 'GET', url: this.config.API_URL + '/tasks'},
  };

  // PROPERTIES: Lit reactive properties can be used to store data and propagate
  static properties = {
    tasks: {type: Array},
  };

  constructor() {
    super();
    this.tasks = [];
  }

  // METHODS: You can establish methods accesible to other component
  async fetchAllTasks() {
    this.tasks = await this.apiCall('getAllTasks');
  }

  async createTask(taskData) {
    await this.apiCall('createTask', taskData);
    this.fetchAllTasks();
  }

  // RENDER: Here you can pass data or methods to the childrens
  render() {
    return html`
      <h1>Todo App</h1>
      <todo-input .createTask=${this.createTask.bind(this)}></todo-input>
      <todo-list .tasks=${this.tasks}></todo-list>
    `;
  }
}

customElements.define('dc-todo-api', TodoAPIConnector);
```

## Consume from components

From a webcomponent you can receive the methods and the data as properties and consume it directly:

```javascript
export class TodoInput extends LitElement {
  static properties = {
    createTask: {type: Function},
  };

  async handleButtonClick() {
      await this.createTask({task: "Test Taks"});
    }
  }

  render() {
    return html`
      <div class="container">
        <button @click=${this.handleButtonClick}>Add Task</button>
      </div>
    `;
  }
}
```

## Consume directly from JS

```html
<dc-todo-api id="todoConnector">
  <dc-todo-api>
    <script>
      // You can establish listener for general api response or for specific endpoint
      document.addEventListener('api-response', (event) => {
        console.log('API response received for endpoint:', event.deatil);
      });

      document.addEventListener('createTask-response', (event) => {
        console.log('API from createTask Data:', event.detail.data);
      });

      // You can iteract with the TODO api connector when it's loaded
      document.addEventListener('DOMContentLoaded', () => {
        const todoConnector = document.getElementById('todoConnector');

        // SET CONFIGS
        console.log(todoConnector.getConfig());
        todoConnector.setConfig({
          API_URL: 'http://localhost:3005',
          JWT: 'jwt_update',
        });
        console.log(todoConnector.getConfig());

        // CALL API CALL OR METHOD
        todoConnector.apiCall('createTask', {
          task: 'New Task',
          status: 'pending',
        });
      });
    </script></dc-todo-api
  ></dc-todo-api
>
```
