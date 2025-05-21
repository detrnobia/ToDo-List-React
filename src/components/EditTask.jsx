import { useState, useEffect, useRef } from "react";

export function EditTask({ todo, onSubmit, onCancel }) {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const modalRef = useRef(null);

  useEffect(() => {
    if (todo) {
      setTaskName(todo.taskName || "");
      setDueDate(todo.dueDate || "");
      setPriority(todo.priority || "low");
    }
  }, [todo]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel(); 
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  function handleSubmit(e) {
    e.preventDefault();
    if (taskName === "" || dueDate === "") return;

    const updatedTask = {
      ...todo,
      taskName,
      dueDate,
      priority,
    };

    onSubmit(updatedTask);
  }

  return (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef}>
        <h2>Edit Task</h2>
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
          <button type="submit" className="btn">
            Update Task
          </button>
          <button type="button" onClick={onCancel} className="btn cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}