import { useState, useEffect } from 'react'
import Login from './components/Login'
import TaskForm from './components/taskForm'
import TaskList from './components/taskList'
import Files from './components/Files'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [tasks, setTasks] = useState([])
  const [vista, setVista] = useState('tasks')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 5

  const getTasks = async (currentPage = page) => {
    const res = await fetch(`/tasks?page=${currentPage}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    const pages = res.headers.get('X-Total-Pages')
    setTotalPages(parseInt(pages) || 1)
    return data
  }

  const createTask = async (title) => {
    await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    })
    const data = await getTasks()
    setTasks(data)
  }

  const updateTask = async (id, changes) => {
    await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(changes)
    })
    const data = await getTasks()
    setTasks(data)
  }

  const deleteTask = async (id) => {
    if (!window.confirm('¿Quieres eliminar esta tarea?')) return
    await fetch(`/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    const newPage = tasks.length === 1 && page > 1 ? page - 1 : page
    setPage(newPage)
    const data = await getTasks(newPage)
    setTasks(data)
  }

  const toggleTask = async (id, completed) => {
    await fetch(`/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ completed: !completed })
    })
    const data = await getTasks()
    setTasks(data)
  }

  const login = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    if (!window.confirm('¿Quieres cerrar sesión?')) return
    localStorage.removeItem('token')
    setToken(null)
    setTasks([])
    setVista('tasks')
    setPage(1)
  }

  const handlePageChange = async (newPage) => {
    setPage(newPage)
    const data = await getTasks(newPage)
    setTasks(data)
  }

  useEffect(() => {
    if (token) getTasks().then(data => setTasks(data))
  }, [token])

  if (!token) return <Login onLogin={login} />

  const pending = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  if (vista === 'files') {
    return <Files token={token} onNavigate={setVista} onLogout={logout} />
  }

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px' }}>Todo List</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setVista('files')}
            style={{
              padding: '6px 14px',
              background: 'transparent',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: 'pointer',
              color: '#555'
            }}
          >
            Archivos
          </button>
          <button
            onClick={logout}
            style={{
              padding: '6px 14px',
              background: 'transparent',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: 'pointer',
              color: '#555'
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <TaskForm onAdd={createTask} />
      <TaskList
        title="Pendientes"
        tasks={pending}
        onToggle={toggleTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
        showActions={true}
      />
      <TaskList
        title="Completadas"
        tasks={completed}
        onToggle={toggleTask}
        showActions={false}
      />

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={{
              padding: '6px 14px',
              background: 'transparent',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              color: page === 1 ? '#ccc' : '#555'
            }}
          >
            Anterior
          </button>
          <span style={{ fontSize: '13px', color: '#888' }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            style={{
              padding: '6px 14px',
              background: 'transparent',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              color: page === totalPages ? '#ccc' : '#555'
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

export default App