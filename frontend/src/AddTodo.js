import { useTodos } from './TodoSchemas';
import { useState } from 'react';
import './AddTodo.css';
function AddTodo() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', task: '', status: 0 });
  const [todos, setTodos] = useTodos();
  const handleSubmit = async () => {
    try {
      const res = await fetch('/add-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newTodo = await res.json();
        setTodos(prev => [...prev, newTodo]);
        setShowModal(false);
        setForm({ name: '', task: '', status: 0 });
      } else {
        alert('Failed to add task');
      }
    } catch (err) {
      console.error('Error adding task', err);
      alert('Failed to add task');
    }
  };
  return (
    <div className="addtodo-container">
      <button className="btn" onClick={() => setShowModal(true)}>Add Task</button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-content">
              <h3 className="modal-title">Add New Todo</h3>
              <input
                className="input"
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Task"
                value={form.task}
                onChange={e => setForm({ ...form, task: e.target.value })}
              />
              <select
                className="input"
                value={form.status}
                onChange={e => setForm({ ...form, status: parseInt(e.target.value) })}
              >
                <option value={0}>Status:Not completed</option>
                <option value={1}>Status: Completed</option>
              </select>
              <div className="actions">
                <button className="btn modal-btn primary" onClick={handleSubmit}>Save</button>
                <button className="btn modal-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AddTodo;
