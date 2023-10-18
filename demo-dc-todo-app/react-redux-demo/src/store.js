// store.js
import { createStore } from "redux";

// Initial State
const initialState = {
  tasks: [],
};

// Reducer
function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case "REMOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
      };
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
      };
    case "UPDATE_TASK":
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload } : task
      );
      return {
        ...state,
        tasks: updatedTasks,
      };
    default:
      return state;
  }
}

// Store
const store = createStore(rootReducer);

export default store;
