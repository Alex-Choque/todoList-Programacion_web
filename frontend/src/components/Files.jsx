import { useState, useEffect, useRef } from 'react'
import { saveAs } from 'file-saver'

function Files({ token, onNavigate, onLogout }) {
  const [files, setFiles] = useState([])
  const inputRef = useRef(null)

  const getFiles = async () => {
    const res = await fetch('/files', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setFiles(data.files)
  }

  const uploadFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    await fetch('/files/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    await getFiles()
  }

  const downloadFile = async (filename) => {
    const res = await fetch(`/files/download/${filename}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const blob = await res.blob()
    saveAs(blob, filename)
  }

  const deleteFile = async (filename) => {
    await fetch(`/files/${filename}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    await getFiles()
  }

  useEffect(() => {
    getFiles()
  }, [])

  const btnStyle = {
    padding: '6px 14px',
    background: 'transparent',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#555'
  }

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px' }}>Archivos</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onNavigate('tasks')} style={btnStyle}>
            Tareas
          </button>
          <button onClick={onLogout} style={btnStyle}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <input
          type="file"
          ref={inputRef}
          onChange={uploadFile}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => inputRef.current.click()}
          style={{
            padding: '6px 14px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Subir archivo
        </button>
      </div>

      {files.length === 0 ? (
        <p style={{ fontSize: '14px', color: '#aaa', textAlign: 'center', marginTop: '2rem' }}>
          No hay archivos subidos
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>
            Mis archivos
          </p>
          {files.map((filename, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                border: '1px solid #e8e8e8',
                borderRadius: '10px'
              }}
            >
              <div style={{ flex: 1, minWidth: 0, marginRight: '12px' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#111', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis' 
                }}>
                  {filename}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  onClick={() => downloadFile(filename)}
                  style={btnStyle}
                >
                  Descargar
                </button>
                <button
                  onClick={() => deleteFile(filename)}
                  style={{ ...btnStyle, color: '#e53e3e' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Files
