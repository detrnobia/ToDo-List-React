import { TodoItem } from "./TodoItem";

export function TodoList({ todos, toggleTodo, deleteTodo, editTodo }) {
  // Sort tasks: incomplete tasks first, completed tasks last
  const sortedTodos = [...todos].sort((a, b) => a.completed - b.completed);

  return (
    <ul className="todo-list">
      {sortedTodos.map((todo) => (
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