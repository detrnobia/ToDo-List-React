import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [dueDateTime, setDueDateTime] = useState('');
  const [priority, setPriority] = useState('Low');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const newTask = {
        title, 
        dueDateTime: dueDateTime.toString(),
        priority,
        completed: false
    };

    addTask({ newTask });
    setTitle('');
    setDueDateTime(new Date());
    setPriority('Low');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task name" required />
      <DatePicker
        selected={dueDate}
        onChange={(date) => setDueDate(date)}
        showTimeSelect
        dateFormat="Pp"
      />

      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Mid">Mid</option>
        <option value="Low">Low</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
