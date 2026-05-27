import { useState, useEffect } from 'react'
import TaskForm from './components/taskForm'
import TaskList from './components/taskList'

function App() {
  const [tasks, setTasks] = useState([])

  const getTasks = async () => {
    const res = await fetch('/tasks')
    const data = await res.json()
    return data
  }

  const createTask = async (title) => {
    await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
    const data = await getTasks()
    setTasks(data)
  }

  const updateTask = async (id, changes) => {
    await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes)
    })
    const data = await getTasks()
    setTasks(data)
  }

  const deleteTask = async (id) => {
    await fetch(`/tasks/${id}`, {
      method: 'DELETE'
    })
    const data = await getTasks()
    setTasks(data)
  }

  const toggleTask = async (id, completed) => {
    await fetch(`/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    })
    const data = await getTasks()
    setTasks(data)
  }

  useEffect(() => {
    getTasks().then(data => setTasks(data))
  }, [])

  const pending = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        Todo List
      </h1>
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