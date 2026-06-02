import { useState } from 'react'

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async () => {
    setError('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El email no es válido')
      return
    }

    if (!isLogin) {
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres')
        return
      }
      if (!/[A-Z]/.test(password)) {
        setError('La contraseña debe tener al menos una mayúscula')
        return
      }
      if (!/[0-9]/.test(password)) {
        setError('La contraseña debe tener al menos un número')
        return
      }
    }

    const url = isLogin ? '/auth/login' : '/auth/register'
    const body = isLogin ? { email, password } : { username, email, password }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    onLogin(data.token)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '12px',
        padding: '2.25rem',
        width: '100%',
        maxWidth: '360px'
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: '500',
          color: '#111',
          marginBottom: '1.75rem',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {isLogin ? 'Inicio de sesión' : 'Registro'}
        </h1>

        {!isLogin && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Nombre de usuario</label>
            <input
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label style={labelStyle}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: '56px' }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                color: '#888',
                fontSize: '12px'
              }}
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
          {error && (
            <p style={{ fontSize: '12px', color: '#e53e3e', marginTop: '6px' }}>
              {error}
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          style={isLogin ? btnLoginStyle : btnRegisterStyle}
        >
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '1.25rem' }}>
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <span
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            style={{ color: '#111', fontWeight: '500', cursor: 'pointer' }}
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </span>
        </p>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' }

const inputStyle = {
  width: '100%',
  padding: '0 12px',
  height: '38px',
  fontSize: '14px',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  outline: 'none',
  color: '#111',
  backgroundColor: '#fff',
  boxSizing: 'border-box'
}

const btnLoginStyle = {
  width: '100%',
  height: '38px',
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  marginTop: '0.25rem'
}

const btnRegisterStyle = {
  width: '100%',
  height: '38px',
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  marginTop: '0.25rem'
}

export default Login
