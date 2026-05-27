import { useState } from 'react'

function TaskBox({ task, onToggle, onUpdate, onDelete, showActions }) {
  const [editing, setEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(task.title)

  const handleSave = () => {
    if (!newTitle.trim()) return
    onUpdate(task._id, { title: newTitle, completed: task.completed })
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      borderBottom: '1px solid #ddd'
    }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task._id, task.completed)}
        style={{ marginRight: '10px', cursor: 'pointer' }}
      />

      {editing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            flex: 1,
            padding: '5px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />
      ) : (
        <span style={{ flex: 1, fontSize: '14px' }}>
          {task.title}
        </span>
      )}

      {showActions && (
        <div>
          {editing ? (
            <>
              <button onClick={handleSave} style={{ marginRight: '5px', cursor: 'pointer' }}>
                Guardar
              </button>
              <button onClick={() => { setNewTitle(task.title); setEditing(false) }} style={{ cursor: 'pointer' }}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} style={{ marginRight: '5px', cursor: 'pointer' }}>
                Editar
              </button>
              <button onClick={() => onDelete(task._id)} style={{ cursor: 'pointer', color: 'red' }}>
                Eliminar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default TaskBox