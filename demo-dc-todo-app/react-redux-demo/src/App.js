// App.js
import React, { useState, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import todoAPI from "./TodoAPIConnector";

// ACTIONS
const addTask = (task) => {
  store.dispatch({ type: "ADD_TASK", payload: task });
};

const removeTask = (taskId) => {
  store.dispatch({ type: "REMOVE_TASK", payload: taskId });
};

const setTasks = (tasks) => {
  store.dispatch({
    type: "SET_TASKS",
    payload: tasks,
  });
};

const updateTask = (task) => {
  store.dispatch({ type: "UPDATE_TASK", payload: task });
};

// REACT COMPONENT
function TodoApp() {
  const [task, setTask] = useState("");
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const handleAddTask = async () => {
    if (task.trim() === "") return;
    const response = await todoAPI.apiCall("create_task", {
      task: task,
      status: "pending",
    });
    addTask(response);
    setTask("");
  };

  const handleRemoveTask = async (taskId) => {
    await todoAPI.apiCall("delete_task", null, { id: taskId });
    removeTask(taskId);
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    await todoAPI.apiCall("update_task", { status }, { id: taskId });
    fetchTasks(); // Fetch the updated task list from the server
  };

  const fetchTasks = async () => {
    const response = await todoAPI.apiCall("get_tasks");
    setTasks(response);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Todo App</h1>
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            <input
              type="checkbox"
              checked={t.status === "completed"}
              onChange={() =>
                handleUpdateTaskStatus(
                  t._id,
                  t.status === "completed" ? "pending" : "completed"
                )
              }
            />
            {t.task}{" "}
            <button onClick={() => handleRemoveTask(t._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  );
}

export default App;
