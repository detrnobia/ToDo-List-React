import { useEffect, useState } from "react"

export default function TaskForm ({ onSubmit, initialTask="", initialDateDue="", initialPriority="", onCancel, isEdit }) {  
  const [todoName, setTodoName] = useState("")
  const [dateDue, setDateDue] = useState(new Date())
  const [priority, setPriority] = useState("")

  useEffect(() => {
    setTodoName(initialTask)
    setDateDue(initialDateDue)
    setPriority(initialPriority)
  }, [initialTask, initialDateDue, initialPriority])

  function handleSubmit(e) {
    e.preventDefault()
    if (!todoName || !dateDue || !priority) {
      alert("Please fill in all fields")
      return
    }

    onSubmit(todoName, dateDue, priority)
    if(!isEdit) {
      setTodoName("")
      setDateDue(new Date())
      setPriority("")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">Item</label>
          <input type="text" id="item" value={todoName} onChange={e => {setTodoName(e.target.value)}}/>
        </div>
        <div className="form-row">
          <label htmlFor="dateDue">Date Due</label>
          <input type="datetime-local" id="dateDue" value={dateDue} onChange={e => {setDateDue(e.target.value)}}/>
        </div>
        <div className="form-row">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={priority} onChange={e => {setPriority(e.target.value)}}>
            <option value="" defaultValue={""}>Select Priority</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
        </div>
        <button type="submit" className="btn">
          {isEdit ? "Update" : "Add"}
        </button>
      </form>
    </div>
  )
}