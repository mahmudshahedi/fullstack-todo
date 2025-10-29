import { useTodos }  from './TodoSchemas';
import './TasksTables.css';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

function TasksTables({ nameFilter = '', statusFilter = 'all' }) {
  const [todoSchema, setTodoSchema] = useTodos();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [completedAtMap, setCompletedAtMap] = useState({});
  const [createdAtMap, setCreatedAtMap] = useState({});

  const formatUtc = (date) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mi = String(d.getUTCMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(todoSchema)) return [];
    return todoSchema.filter(t => {
      const nameOk = nameFilter.trim() === '' ? true : (t.name || '').toLowerCase().includes(nameFilter.toLowerCase());
      const statusOk = statusFilter === 'all' ? true : (statusFilter === 'completed' ? t.status === 1 : t.status !== 1);
      return nameOk && statusOk;
    });
  }, [todoSchema, nameFilter, statusFilter]);

  const total = Array.isArray(filtered) ? filtered.length : 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(total, startIdx + pageSize);
  const pageItems = useMemo(() => {
    return filtered.slice(startIdx, startIdx + pageSize);
  }, [filtered, startIdx, pageSize]);

  // initialize maps when data arrives
  useEffect(() => {
    if (!Array.isArray(todoSchema)) return;
    setCreatedAtMap(prev => {
      const next = { ...prev };
      for (const t of todoSchema) {
        if (!next[t._id]) {
          const fromServer = t.createdAt ? formatUtc(t.createdAt) : 'N/A';
          next[t._id] = fromServer;
        }
      }
      return next;
    });
    setCompletedAtMap(prev => {
      const next = { ...prev };
      for (const t of todoSchema) {
        if (t.status === 1 && t.completedAt) {
          next[t._id] = formatUtc(t.completedAt);
        } else if (t.status !== 1 && next[t._id]) {
          delete next[t._id];
        }
      }
      return next;
    });
  }, [todoSchema]);

  const windowSize = 5;
  let startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let endPage = startPage + windowSize - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - windowSize + 1);
  }
  const pageNumbers = [];
  for (let p = startPage; p <= endPage; p++) pageNumbers.push(p);

  return (
    <div className="tasks-card">
      {todoSchema ? (
        <>
          <div className="table-wrapper">
            <table className="tasks-table">
          <thead>
                <tr><th>No.</th><th>Name</th><th className="col-task">Task</th><th>Status</th><th>Created At / Completed At</th><th>Function</th></tr>
          </thead>
          <tbody>
                {total === 0 ? (
                  <tr>
                    <td className="muted" colSpan="7">No data</td>
                  </tr>
                ) : pageItems.map((todo, idx) => (
                  <tr key={todo._id} className={todo.status === 1 ? 'row-completed' : ''}>
                    <td>{startIdx + idx + 1}</td>
                <td>{todo.name}</td>
                <td className="col-task">{todo.task}</td>
                    <td className={`status-cell${todo.status === 1 ? ' completed' : ''}`}>
                      <span className={`status-dot ${todo.status === 1 ? 'done' : 'pending'}`} />
                      {todo.status === 1 ? 'Completed' : 'Not completed'}
                    </td>
                    <td className="col-dates">
                      <div className="date-line">{createdAtMap[todo._id] || 'N/A'}</div>
                      <div className="date-line">{todo.status === 1 ? (completedAtMap[todo._id] || 'N/A') : 'Not yet completed'}</div>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn warn"
                    onClick={async () => {
                      const newStatus = todo.status === 0 ? 1 : 0;
                      const res = await fetch('/edit-todo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          id: todo._id,
                          updateData: { status: newStatus },
                        }),
                      });
                      if (res.ok) {
                        setTodoSchema(prev => prev.map(t => t._id === todo._id ? { ...t, status: newStatus } : t));
                              if (newStatus === 1) {
                                setCompletedAtMap(prev => ({ ...prev, [todo._id]: formatUtc(new Date()) }));
                              } else {
                                setCompletedAtMap(prev => {
                                  const next = { ...prev };
                                  delete next[todo._id];
                                  return next;
                                });
                              }
                      } else {
                              alert('Update failed');
                      }
                    }}
                  >
                          Change Status
                  </button>
                        <button className="icon-btn trash"
                    onClick={async () => {
                      const res = await fetch('/delete-todo', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: todo._id }),
                      });
                      if (res.ok) {
                        setTodoSchema(prev => prev.filter(t => t._id !== todo._id));
                      } else {
                              alert('Delete failed');
                      }
                    }}
                          aria-label="Delete"
                  >
                          <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                      </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
          <div className="pagination">
            <div className="pagination-summary">
              Showing {total === 0 ? 0 : startIdx + 1}–{endIdx} of {total}
            </div>
            <div className="pagination-controls">
              <button
                className="page-btn arrow"
                disabled={currentPage === 1 || total === 0}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                {"<"}
              </button>
              {pageNumbers.map(p => (
                <button
                  key={p}
                  className={`page-btn${p === currentPage ? ' active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="page-btn arrow"
                disabled={currentPage === totalPages || total === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                {">"}
              </button>
            </div>
          </div>
        </>
      ) : "Loading..."}
    </div>
  );
}

export default TasksTables;