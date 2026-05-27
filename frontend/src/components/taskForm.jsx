import { useState } from 'react'

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')

  const handleSubmit = () => {
    if (!title.trim()) return
    onAdd(title)
    setTitle('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Nueva tarea..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: '70%',
          padding: '8px',
          border: '1px solid #ccc',
          fontSize: '14px'
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '8px 15px',
          marginLeft: '10px',
          background: 'black',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Agregar
      </button>
    </div>
  )
}

export default TaskForm