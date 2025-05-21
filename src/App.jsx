import { useEffect, useState } from "react";
import { AddTask } from "./components/AddTask";
import { EditTask } from "./components/EditTask";
import { DeleteTask } from "./components/DeleteTask";
import "./index.css";
import { TodoList } from "./components/TodoList";
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore"; 
import { db } from "./firebase/firebaseConfig";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [visibleTodosCount, setVisibleTodosCount] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [deletedTodo, setDeletedTodo] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [deleteTimeout, setDeleteTimeout] = useState(null);
  const [sortBy, setSortBy] = useState("dateAddedOld");

  useEffect(() => {
    async function fetchTodos() {
      try {
        const querySnapshot = await getDocs(collection(db, "todos"));
        const todosFromFirebase = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(todosFromFirebase);
      } catch (error) {
        console.error("Error fetching todos from Firebase:", error);
      }
    }
    fetchTodos();
  }, []);

  function getSortedTodos(todos) {
    let sortedTodos = [...todos];
    if (sortBy === "dateAddedRecent") {
      sortedTodos.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (sortBy === "dateAddedOld") {
      sortedTodos.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    } else if (sortBy === "dueDateInc") {
      sortedTodos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "dueDateDec") {
      sortedTodos.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else if (sortBy === "priorityInc") {
      const priorityOrder = { low: 1, mid: 2, high: 3 };
      sortedTodos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === "priorityDec") {
      const priorityOrder = { low: 1, mid: 2, high: 3 };
      sortedTodos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }
    return sortedTodos;
  }

  async function addTodo(newTask) {
    try {
      const docRef = await addDoc(collection(db, "todos"), newTask);
      const taskWithId = { id: docRef.id, ...newTask };
      setTodos((currentTodos) => [...currentTodos, taskWithId]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding task to Firestore:", error);
    }
  }

  async function updateTodo(updatedTask) {
    try {
      const todoDoc = doc(db, "todos", updatedTask.id);
      await updateDoc(todoDoc, updatedTask);
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === updatedTask.id ? { ...todo, ...updatedTask } : todo
        )
      );
      setTodoToEdit(null);
    } catch (error) {
      console.error("Error updating task in Firestore:", error);
    }
  }

  function handleSeeMore() {
    setVisibleTodosCount((prevCount) => prevCount + 5);
  }

  function handleSeeLess() {
    setVisibleTodosCount((prevCount) => Math.max(prevCount - 5, 5));
  }

  function deleteTodo(id) {
    const todoToDelete = todos.find((todo) => todo.id === id);
    if (!todoToDelete) return;
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoToDelete.id)
    );
    setDeletedTodo(todoToDelete);
    setShowToast(true);
    setTodoToDelete(null);
    const timeout = setTimeout(async () => {
      try {
        await deleteDoc(doc(db, "todos", todoToDelete.id));
        console.log(`Task ${todoToDelete.id} deleted from Firestore`);
      } catch (error) {
        console.error("Error deleting task from Firestore:", error);
      } finally {
        setDeletedTodo(null);
        setShowToast(false);
      }
    }, 3000);
    setDeleteTimeout(timeout);
  }

  function undoDelete() {
    if (!deletedTodo) return;
    clearTimeout(deleteTimeout);
    setTodos((currentTodos) => [...currentTodos, deletedTodo]);
    setDeletedTodo(null);
    setShowToast(false);
  }

  return (
    <div className="app-container">
      <h1 className="header" align="center">Todo List</h1>
      {!showForm && (
        <div className="center-container">
          <button onClick={() => setShowForm(true)} className="btn">
            Add Task
          </button>
        </div>
      )}
      {showForm && (
        <div className="center-container">
          <AddTask
            onSubmit={addTodo}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
      <div className="sort-container">
        <label htmlFor="sortBy">Sort By:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-dropdown"
        >
          <option value="dateAddedOld">Date Added (Old)</option>
          <option value="dateAddedRecent">Date Added (Recent)</option>
          <option value="dueDateInc">Due Date (Ascending)</option>
          <option value="dueDateDec">Due Date (Descending)</option>
          <option value="priorityInc">Priority (Increasing)</option>
          <option value="priorityDec">Priority (Decreasing)</option>
        </select>
      </div>
      {todoToEdit && (
        <EditTask
          todo={todoToEdit}
          onSubmit={updateTodo}
          onCancel={() => setTodoToEdit(null)}
        />
      )}
      {todoToDelete && (
        <DeleteTask
          todo={todoToDelete}
          onConfirm={() => deleteTodo(todoToDelete.id)}
          onCancel={() => setTodoToDelete(null)}
        />
      )}
      <TodoList
        todos={getSortedTodos(todos).slice(0, visibleTodosCount)}
        toggleTodo={(id, completed) => {
          setTodos((currentTodos) =>
            currentTodos.map((todo) =>
              todo.id === id ? { ...todo, completed } : todo
            )
          );
          const todoDoc = doc(db, "todos", id);
          updateDoc(todoDoc, { completed }).catch((error) =>
            console.error("Error updating task in Firestore:", error)
          );
        }}
        deleteTodo={(id) =>
          setTodoToDelete(todos.find((todo) => todo.id === id))
        }
        editTodo={(id) => setTodoToEdit(todos.find((todo) => todo.id === id))}
      />
      <div className="center-container">
        {visibleTodosCount < todos.length && (
          <button onClick={handleSeeMore} className="btn see-more-btn">
            See More
          </button>
        )}
        {visibleTodosCount > 5 && (
          <button onClick={handleSeeLess} className="btn see-less-btn">
            See Less
          </button>
        )}
      </div>
      {showToast && (
        <div className="toast">
          <span>Task deleted</span>
          <button onClick={undoDelete} className="btn-undo">
            Undo
          </button>
        </div>
      )}
    </div>
  );
}