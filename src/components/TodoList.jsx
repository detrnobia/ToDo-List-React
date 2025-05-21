import { TodoItem } from "./TodoItem"

export function TodoList({ todos, toggleTodo, deleteTodo, editTodo }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          taskName={todo.taskName}
          dueDate={todo.dueDate}
          dateAdded={todo.dateAdded}
          priority={todo.priority}
          completed={todo.completed}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      ))}
    </ul>
  );
}