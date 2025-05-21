import { FaEdit, FaTrash } from "react-icons/fa"; 
import React from "react";

export function TodoItem({ completed, id, taskName, dueDate, dateAdded, priority = "low", toggleTodo, deleteTodo, editTodo }) {
  return (
    <li className={`todo-item priority-${priority} ${completed ? "completed" : ""}`}>
      <div className="todo-content">
        <label>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => toggleTodo(id, e.target.checked)}
          />
          <span className="task-title">{taskName}</span>
        </label>
        <p className="task-due-date">Due: {new Date(dueDate).toLocaleString()}</p>
        <p className="task-date-added">Added: {new Date(dateAdded).toLocaleString()}</p>
      </div>
      <div className="todo-actions">
        <button onClick={() => editTodo(id)} className="btn-icon edit">
          <FaEdit /> 
        </button>
        <button onClick={() => deleteTodo(id)} className="btn-icon delete">
          <FaTrash /> 
        </button>
      </div>
    </li>
  );
}