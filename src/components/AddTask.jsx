import React, { useState } from 'react';

export function AddTask({ onSubmit, onCancel }) {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [showErrorModal, setShowErrorModal] = useState(false); 

  function handleSubmit(e) {
    e.preventDefault();

    if (taskName === "" || dueDate === "") {
      setShowErrorModal(true); 
      return;
    }

    const newTask = {
      taskName,
      dueDate,
      priority,
      dateAdded: new Date().toISOString(),
      completed: false,
    };

    onSubmit(newTask);
    setTaskName("");
    setDueDate("");
    setPriority("low");
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="new-item-form">
        <div className="form-row">
          <label htmlFor="taskName">Task Name</label>
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            type="text"
            id="taskName"
            placeholder="Enter task name"
          />
        </div>
        <div className="form-row">
          <label htmlFor="dueDate">Due Date and Time</label>
          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            type="datetime-local"
            id="dueDate"
          />
        </div>
        <div className="form-row">
          <label htmlFor="priority">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            id="priority"
          >
            <option value="high">High</option>
            <option value="mid">Mid</option>
            <option value="low">Low</option>
          </select>
        </div>

        <button type="submit" className="btn">Add Task</button>
        <button type="button" onClick={onCancel} className="btn cancel-btn">Cancel</button>
      </form>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Please fill out all required fields.</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="btn close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}