# DataConnector WOP

## Install and start

```javascript
npm install
npm start
```

## Data Connector

The DataConnector is a flexible and extensible class designed to facilitate API interactions and manage states. It provides a structured way to define API endpoints, handle API calls, and emit events to connected web components. To start a new connector you can extend the DataConnector class and use some of the defined methods to create configurations, endpoints and states:

```javascript
class TodoAPIConnector extends DataConnector {
  ...
```

### Configuration (Config)

The initConfig method is intended for initial configurations. It can contain default values but can be overridden when needed.

```javascript
initConfig() {
  return {
    API_URL: "http://default-api-url.com",
    JWT_TOKEN: 'TOKEN',
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

### API Call Handler

The apiCall method is your primary tool for interacting with APIs, is designed to make asynchronous requests to your API. It abstracts away the complexities of setting up fetch requests

To use apiCall, you'll typically call it with an endpointKey (which corresponds to a specific API endpoint you've defined) and, if needed, additional data or parameters.

```javascript
dataConnector.apiCall("get_user", null, { id: 123 });
```

For each API call made using a defined endpoint, an automatic event is generated. This allows you to listen for specific API responses in other parts of your application, the even will be

### States

DataConnector provides a simple state management system. You can define default states in the initStates method. These states can be anything relevant to your application, like a list of items, user data, etc.

```javascript
initStates() {
  return {
    users: [],
    // ... other states
  };
}
```

You can then update these states using the setStates({user:[]}) method and retrieve them using getStates()

### Methods

While apiCall handles most general use cases, you might have specific needs, like preprocessing data before making a request or handling responses in a particular way. Since you're extending the class, you can add additional methods on the class.

```javascript
async getUser(id, updatedData) {
  const users = await this.apiCall("get_users", updatedData, { id });
  this.setState({users});
}

filterUsersByName(name) {
    const allUsers = this.getState().users;
    const filteredUsers = allUsers.filter(user => user.name === name);
    this.setStates({ users: filteredUsers });
}
```

### Use on webcomponents

To use this connector, you instantiate it, also you can user setConfig method allows you to override or extend the default configuration of the connector. This is particularly useful if you have environment-specific configurations or if you need to update configurations dynamically.

```javascript
const userAPI = new UserAPIConnector();
This creates an instance of UserAPIConnector with the default configurations, endpoints, and states defined in the initConfig, initEndpoints, and initStates methods respectively.

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
