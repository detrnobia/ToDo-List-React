import React, { useState } from 'react';

const TaskItem = ({ task, deleteTask, toggleComplete, editTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleEdit = () => {
    editTask(task.id, { title: newTitle });
    setIsEditing(false);
  };

  const priorityColor = {
    High: 'red',
    Mid: 'orange',
    Low: 'green'
  };

  return (
    <div style = {{ margin: '10px 0'}}>
      <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} />
      {isEditing ? (
        <>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <button onClick={handleEdit}>Save</button>
        </>
      ) : (
        <>
          <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title} - {task.dueDateTime}
          </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default TaskItem;
