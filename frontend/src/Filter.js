import './Filter.css';

function Filter({ nameFilter, statusFilter, onNameChange, onStatusChange }) {
  return (
    <div className="filter-card">
      <h2 className="filter-title">Filters</h2>
      <div className="filter-row">
        <div className="filter-field">
          <label className="filter-label">Name</label>
          <input
            className="filter-input"
            type="text"
            placeholder="Filter by name..."
            value={nameFilter}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="filter-field">
          <label className="filter-label">Status</label>
          <select
            className="filter-input"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="not_completed">Not completed</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filter;


