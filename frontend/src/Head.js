import { useEffect, useState } from 'react';

function Head() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  const ss = String(now.getUTCSeconds()).padStart(2, '0');
  const yyyy = now.getUTCFullYear();
  const mon = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

  return (
    <div className="todo-header">
      <h1 className="todo-title">Todo App</h1>
      <div className="todo-clock">
        <div className="time">UTC {hh}:{mm}:{ss}</div>
        <div className="date">{yyyy}-{mon}-{dd} · {weekday}</div>
      </div>
    </div>
  );
}

export default Head;



