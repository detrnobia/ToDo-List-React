import React from "react";

export function DeleteTask({ todo, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete the task "{todo.taskName}"?</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="btn delete-btn">
            Delete
          </button>
          <button onClick={onCancel} className="btn cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}