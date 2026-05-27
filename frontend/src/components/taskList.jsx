import TaskBox from './taskBox'

function TaskList({ title, tasks, onToggle, onUpdate, onDelete, showActions }) {
  if (tasks.length === 0) return null

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '14px', color: 'gray', marginBottom: '10px' }}>
        {title}
      </h3>
      <div>
        {tasks.map(task => (
          <TaskBox
            key={task._id}
            task={task}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
            showActions={showActions}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskList