import {LitElement, html, css} from 'lit';

export class TodoList extends LitElement {
  static styles = css`
    ul {
      list-style-type: none;
      padding: 0;
    }

    .task {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-bottom: 1px solid #ccc;
    }

    .task span.completed {
      text-decoration: line-through;
      color: #888;
    }

    button {
      padding: 4px 8px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #c82333;
    }
  `;
  static properties = {
    tasks: {type: Array},
    updateTask: {type: Function},
    deleteTask: {type: Function},
  };

  constructor() {
    super();
    this.tasks = []; // Default value
  }

  handleTaskCompletion(task) {
    const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';
    if (this.updateTask) {
      this.updateTask(task._id, {status: updatedStatus});
    }
  }

  handleTaskDeletion(taskId) {
    if (this.deleteTask) {
      this.deleteTask(taskId);
    }
  }

  render() {
    return html`
      <ul>
        ${this.tasks.map(
          (task) => html`
            <li class="task">
              <input
                type="checkbox"
                .checked=${task.status === 'completed'}
                @change=${() => this.handleTaskCompletion(task)}
              />
              <span class=${task.status === 'completed' ? 'completed' : ''}>
                ${task.task}
              </span>
              <button @click=${() => this.handleTaskDeletion(task._id)}>
                Delete
              </button>
            </li>
          `
        )}
      </ul>
    `;
  }
}

customElements.define('todo-list', TodoList);
