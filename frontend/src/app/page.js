'use client';

import { useEffect, useState } from 'react';

import '../../styles/globals.css';

const API_URL = 'http://localhost:3001/tasks';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creator, setCreator] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTasks(data);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCreator('');
    setIsEditing(false);
    setEditingId(null);
  };

  const addTask = async (e) => {
    e.preventDefault();
    const newTask = { title, description, creator, isCompleted: false };

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });

    resetForm();
    fetchTasks();
  };

  const updateTask = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, creator, isCompleted: false }),
    });

    resetForm();
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const toggleCompletion = async (id) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...taskToUpdate, isCompleted: !taskToUpdate.isCompleted }),
    });
    fetchTasks();
  };

  const startEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setCreator(task.creator);
    setIsEditing(true);
    setEditingId(task.id);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>To-Do List Kolaboratif</h1>

      <form onSubmit={isEditing ? updateTask : addTask} style={{
        marginBottom: '2rem',
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '400px'
      }}>
        <input
          type="text"
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Pembuat (User A / B)"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          required
        />
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          {isEditing ? 'Update Tugas' : 'Tambah Tugas'}
        </button>
        {isEditing && (
          <button type="button" onClick={resetForm} style={{ marginLeft: '1rem' }}>
            Batal Edit
          </button>
        )}
      </form>

      <ul style={{ padding: 0, listStyle: 'none' }}>
        {tasks.map((task) => (
          <li key={task.id} style={{
            backgroundColor: 'white',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            color: '#222'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                {task.title}
              </span>
              {task.isCompleted && <span>✅</span>}
            </div>
            <p style={{ margin: 0 }}>{task.description}</p>
            <p style={{ fontSize: '0.9rem', color: '#555' }}>(by {task.creator})</p>
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => toggleCompletion(task.id)}>
                {task.isCompleted ? 'Undo' : 'Selesai'}
              </button>
              <button onClick={() => startEdit(task)} style={{ marginLeft: '0.5rem' }}>
                Edit
              </button>
              <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '0.5rem' }}>
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
