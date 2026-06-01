import { useState, useEffect } from 'react'
import Login from './components/Login'
import TaskForm from './components/taskForm'
import TaskList from './components/taskList'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [tasks, setTasks] = useState([])

  const getTasks = async () => {
    const res = await fetch('/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
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
    await fetch(`/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await getTasks()
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
    localStorage.removeItem('token')
    setToken(null)
    setTasks([])
  }

  useEffect(() => {
    if (token) getTasks().then(data => setTasks(data))
  }, [token])

  if (!token) return <Login onLogin={login} />

  const pending = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px' }}>
          Todo List
        </h1>
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
    </div>
  )
}

export default App