import { useState, useEffect, useRef } from 'react';
export default function useTodoSchemas() {
  const [todoSchema, setTodoSchema] = useState(null);
  useEffect(() => {
    fetch('/todo-schema')
      .then(res => res.json())
      .then(data => setTodoSchema(data));
  }, []);
  return [todoSchema, setTodoSchema];
}
export function useTodos() {
  // global store to keep todos in sync across components
  const [stateTodos, setStateTodos] = useState(globalTodos);
  const cbRef = useRef(null);

  useEffect(() => {
    cbRef.current = (newTodos) => setStateTodos(newTodos);
    subscribers.add(cbRef.current);
    return () => {
      if (cbRef.current) subscribers.delete(cbRef.current);
    };
  }, []);

  const setTodosGlobal = (updater) => {
    const next = typeof updater === 'function' ? updater(globalTodos) : updater;
    globalTodos = next;
    subscribers.forEach(cb => cb(next));
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch('/todo-schema');
        if (res.ok) {
          const data = await res.json();
          setTodosGlobal(data);
        }
      } catch (err) {
        console.error('Error loading tasks', err);
      }
    };
    fetchTodos();
  }, []);

  return [stateTodos, setTodosGlobal];
}

// global store (module scoped)
let globalTodos = [];
const subscribers = new Set();