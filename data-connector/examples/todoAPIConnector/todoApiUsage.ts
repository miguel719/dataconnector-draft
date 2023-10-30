import TodoAPIConnector from "./TodoAPIConnector";

async function main() {
  const todoAPI = new TodoAPIConnector();

  // Reflection MEthos
  const todos = await todoAPI.getTodos();
  console.log("Todos:", todos);

  const newTodo = await todoAPI.createTodo({
    title: "Learn Code",
    completed: false,
  });
  console.log("New Todo:", newTodo);

  const updatedTodo = await todoAPI.updateTodo(newTodo.data._id, {
    title: "Learn TypeScript",
    completed: true,
  });
  console.log("Updated Todo:", updatedTodo);

  const deletedTodo = await todoAPI.deleteTodo(updatedTodo.data._id);
  console.log("Deleted Todo:", deletedTodo);
}

main();
