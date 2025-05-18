import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [deletedTask, setDeletedTask] = useState(null);
  const [sortBy, setSortBy] = useState('Date Added');

  // Load tasks from mock backend
  useEffect(() => {
    axios.get('http://localhost:5000/tasks').then(res => setTasks(res.data));
  }, []);

  const addTask = (task) => {
    axios.post('http://localhost:5000/tasks', task).then(res => {
      setTasks(prev => [...prev, res.data]);
    });
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setDeletedTask(taskToDelete);

    axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
      setTasks(tasks.filter(task => task.id !== id));
      toast(
        <div>
          Task deleted
          <button onClick={undoDelete}>Undo</button>
        </div>,
        { autoClose: 3000 }
      );
    });
  };

  const undoDelete = () => {
    if (deletedTask) {
      axios.post('http://localhost:5000/tasks', deletedTask).then(res => {
        setTasks(prev => [...prev, res.data]);
        setDeletedTask(null);
      });
    }
  };

  const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    axios
      .patch(`http://localhost:5000/tasks/${id}`, { completed: !task.completed })
      .then(() => {
        setTasks(tasks.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ));
      });
  };

  const editTask = (id, updatedData) => {
    axios.patch(`http://localhost:5000/tasks/${id}`, updatedData).then(() => {
      setTasks(tasks.map(t => (t.id === id ? { ...t, ...updatedData } : t)));
    });
  };

  const sortTasks = (tasks) => {
    switch (sortBy) {
      case 'Due Date':
        return [...tasks].sort((a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime));
      case 'Priority':
        const priorityOrder = { High: 1, Mid: 2, Low: 3 };
        return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      default:
        return tasks;
    }
  };

  return (
    <div className="container">
      <h1>To Do List</h1>
      <TaskForm addTask={addTask} />

      <div>
        <label>Sort by: </label>
        <select onChange={e => setSortBy(e.target.value)} value={sortBy}>
          <option>Date Added</option>
          <option>Due Date</option>
          <option>Priority</option>
        </select>
      </div>

      <TaskList
        tasks={sortTasks(tasks)}
        deleteTask={deleteTask}
        toggleComplete={toggleComplete}
        editTask={editTask}
      />

      <ToastContainer />
    </div>
  );
};

export default App;
