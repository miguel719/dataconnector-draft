# DataConnector

## How to install

For now you can include it as module adding the path of this repo to your package.json

```javascript
  "dependencies": {
    "data-connector" : "file:../data-connector",
```

## Data Connector

The DataConnector is a flexible and extensible class designed to facilitate API interactions and related methods. It provides a structured way to define API endpoints, handle API calls, and emit events to connected web components. To start a new connector you can extend the DataConnector class and use some of the defined methods to create configurations and endpoints:

```javascript
class TodoAPIConnector extends DataConnector {
  ...
```

### Configuration (Config)

The initConfig method is intended for static configurations. It can contain default values but can be overridden when needed.

```javascript
initConfig() {
  return {
    API_URL: "http://default-api-url.com", // You can set directly the default value
    JWT_TOKEN: {default: 'TOKEN', type: String}, // Also can define along the type
    ...etc
  };
}
```

### Endpoints

Define the API endpoints using the initEndpoints method. You can use configuration values associated with an API URL and HTTP method.
javascript. Notice the {id} in the URL? This is a placeholder. When you call apiCall, you can provide values for these placeholders using the queryParams argument

```javascript
initEndpoints() {
  return {
    get_users: { method: "GET", url: `${this.config.API_URL}/data` },
    get_data_by_id: { method: "GET", url: `${this.config.API_URL}/data/{id}` },
    post_data: { method: "POST", url: `${this.config.API_URL}/data` },
  };
}
```

You also can set the headers that are sent when an apiCall is run:

```javascript
this.setDefaultHeaders({ Authorization: "my-token" });
```

### API Call Handler

The apiCall method is your primary tool for interacting with APIs, is designed to make asynchronous requests to your API. It abstracts away the complexities of setting up fetch requests

To use apiCall, you'll typically call it with an endpointKey (which corresponds to a specific API endpoint you've defined) and, if needed, additional data or parameters.

```javascript
// dataConnector.apiCall("apicall_id", bodyData, queryData);
dataConnector.apiCall("create_user", { username: "Robert" }, { query_id: 123 });
```

For each API call made using a defined endpoint, an automatic event is generated. This allows you to listen for specific API responses in other parts of your application, the even will be the endpoint id plus "\_response"

```javascript
document.addEventListener("get_users_res", (e) => {
  this.users = e.detail.data;
});
```

### Methods

While apiCall handles most general use cases, you might have specific needs, like preprocessing data before making a request or handling responses in a particular way. Since you're extending the class, you can add additional methods on the class.

Note: The data connector is not intended to be a state manager, so it's not recommended to store data inside.

```javascript
async getUser(id, updatedData) {
  const users = await this.apiCall("get_users", updatedData, { id });
  this.setState({users});
}

filterUsersByName(name) {
    const allUsers = this.getState().users;
    const filteredUsers = allUsers.filter(user => user.name === name);
    this.setState({ users: filteredUsers });
}
```

On the this methods you can also set custom events so other component can listen to that

```javascript
async deleteUser(id, updatedData) {
  const user = await this.apiCall("delete_user", null, { id });
  this.setState({users: []});
  // emitEvent(eventName: string, detail: any)
  emitEvent('user_deleted', user)
}

```

### Reacting to apicalls

When you implement a DataConnector on your application, this are some suggested methodsto handle the API responses.
1.- Listening to events, each endpoint emit a custom event when it get the response so you can set a listener on different components.

```javascript
document.addEventListener("get_users_res", (e) => {
  this.users = e.detail.data;
});
```

2.- Direclty handle the apicall response. If you already have a component, store, etc. You can directly get the data from the apiCall method

```javascript
const apiResponse = await userAPI.apiCall("create_user", { name: "Robert" });
// The reponse will contain { data, url, statusCode };
if (statusCode !== 200) {
  throw "invalid response";
}
myComponent.setState({ user: apiResponse.data });
```

3.- Callbacks. When you are creating custom methods you can add callbacks to pass custom data to it:

```javascript
// You can declare a method with callbacks
getUsersAndFilter(name, callback) {
  const apiResponse = this..apiCall("get_users")
    const allUsers = apiResponse.data.users;
    const filteredUsers = allUsers.filter(user => user.name === name);
    callback(filteredUsers)
}

// Then you can call the method like this
apiUsers.getUsersAndFilter("Robert", myStore.setUsers);
```

### Example with webcomponents

To use this connector, you instantiate it, also you can user setConfig method allows you to override or extend the default configuration of the connector. This is particularly useful if you have environment-specific configurations or if you need to update configurations dynamically.

```javascript
const userAPI = new UserAPIConnector();
//This creates an instance of UserAPIConnector with the default configurations, endpoints, and states defined in the initConfig, //initEndpoints, and initState methods respectively.

userAPI.setConfig({
  API_URL: "http://new-api-url.com",
});
```

You can use the methods and events to connect the functionality on a webcomponent:

```javascript
import userAPI from './UserAPIConnector.js';

export class UserList extends LitElement {
  ...
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('get_users_res', (e) => {
      this.users = e.detail.data;
    });
    userAPI.apiCall('get_users');
  }

  async handleAddUser() {
      await userAPI.apiCall('add_user', { name: this.newUser });
      userAPI.apiCall('get_users'); // Refresh the user list
    }
  }

  render() {
    return html`
      <ul class="user-list">
        ${this.users.map(user => html`<li>${user.name}</li>`)}
      </ul>
      <div class="add-user">
        <input type="text" .value=${this.newUser} @input=${this.handleInputChange} placeholder="Add user" />
        <button @click=${this.handleAddUser}>Add</button>
      </div>
    `;
  }
}

```

### Error Handler

The connector have a default error handler that log the errors, you can all to register the errors:

```javascript
  getUser() {
    const users = await fetchUsers();
    if(users.error) {
      this.errorHandler(users.error);
    }
  }
```

also you can overide to handle the methods:

```javascript
  ...
  errorHandler(error) {
    super.errorHandler(error);
    // logic to handle error
  }
```

### Data Connector Display

The Connector Display is a tool to help to visualize and the Data Connector. This a webcomponent based on Lit and you can implement like this:

```javascript
import { DataConnector, ConnectorDisplay } from "data-connector";

class TodoAPIConnector extends DataConnector {
  // CONFIGURATION
  initConfig() {
    return {
      API_URL: "http://localhost:2000",
    };
  }

  // ENDPOINTS
  initEndpoints() {
    return {
      create_task: {
        method: "POST",
        url: this.config.API_URL + "/tasks",
        sample_request_data: { task: "Shopping", status: "pending" }, // You can set sample data for the endpoint
      },
      get_tasks: { method: "GET", url: this.config.API_URL + "/tasks" },
    };
  }
}

const todoAPI = new TodoAPIConnector();

// On HTML you can import the webcomponent like this and add the connector to display
<connector-display id="todoAPIDisplay"></connector-display>;
document.addEventListener("DOMContentLoaded", (event) => {
  const connectorDisplay = document.getElementById("todoAPIDisplay");
  connectorDisplay.connector = todoAPI;
});
```
