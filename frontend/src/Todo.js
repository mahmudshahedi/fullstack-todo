import './Todo.css';
import AddTodo from './AddTodo';
import TasksTables from './TasksTables';
import Head from './Head';
import { useState } from 'react';
import Filter from './Filter';
function Todo() {
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  return (
    <div className="todo-page">
      <div className="todo-card">
        <Head />
        <div className="todo-body">
          <AddTodo />
          <Filter
            nameFilter={nameFilter}
            statusFilter={statusFilter}
            onNameChange={setNameFilter}
            onStatusChange={setStatusFilter}
          />
          <TasksTables nameFilter={nameFilter} statusFilter={statusFilter} />
        </div>
      </div>
    </div>
  );
}
export default Todo;
