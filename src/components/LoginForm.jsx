import { useState } from 'react'
import { limpiarTexto } from '../utils/sanitizar.js'

const ADMIN_USER = {
  nombre: 'Administrador',
  email: 'admin@itprogs.com',
  password: 'Admin123!',
  role: 'admin',
}

// ============================================================
// LoginForm.jsx — Formulario controlado de acceso de usuarios
// Cada input está vinculado a su estado (formulario controlado).
// Cada <label> usa htmlFor para asociarse a su input.
// Aplica validaciones por estado y sanitización XSS.
// Recibe handleValidacion e inscritos vía props.
// ============================================================

export default function LoginForm({ inscritos, handleValidacion, onLogin, notify }) {
  // Estado controlado para cada campo
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const [salidaLogin, setSalidaLogin] = useState('Salida: esperando credenciales válidas.')

  function procesarLogin(evento) {
    evento.preventDefault()

    const camposAValidar = [
      { valor: email, nombre: 'loginEmail', etiqueta: 'Correo electrónico', tipo: 'email' },
      { valor: password, nombre: 'loginPassword', etiqueta: 'Contraseña', tipo: 'password' },
    ]

    // handleValidacion se recibe del padre vía props
    const resultado = handleValidacion(camposAValidar)

    if (!resultado.valido) {
      setMensaje({ texto: resultado.errores.join(' '), tipo: 'error' })
      setSalidaLogin('Salida: credenciales rechazadas por validación.')
      if (typeof notify === 'function') {
        notify({
          title: 'Error de validación',
          description: resultado.errores.join(' '),
          state: 'error',
        })
      }
      return
    }

    // Sanitizar y buscar en la lista de inscritos
    const emailLimpio = limpiarTexto(email).toLowerCase()
    const passwordLimpio = password.trim()

    if (emailLimpio === ADMIN_USER.email && passwordLimpio === ADMIN_USER.password) {
      const { password: _, ...datosPublicos } = ADMIN_USER
      if (typeof onLogin === 'function') {
        onLogin(datosPublicos)
      }
      setEmail('')
      setPassword('')
      setMensaje({ texto: `Bienvenido/a, ${ADMIN_USER.nombre}.`, tipo: 'success' })
      setSalidaLogin('Salida: administrador autenticado.')
      return
    }

    const usuario = inscritos.find(
      (item) => item.email === emailLimpio && item.password === passwordLimpio
    )

    if (!usuario) {
      setMensaje({ texto: 'Credenciales incorrectas o usuario no registrado.', tipo: 'error' })
      setSalidaLogin('Salida: no existe una coincidencia en la lista de inscritos.')
      if (typeof notify === 'function') {
        notify({
          title: 'Falló el login',
          description: 'Usuario o contraseña incorrectos.',
          state: 'error',
        })
      }
      return
    }

    // Excluir contraseña de la salida por seguridad
    const { password: _, ...datosPublicos } = usuario

    // Comunicar al padre que el usuario ha iniciado sesión
    if (typeof onLogin === 'function') {
      onLogin(datosPublicos)
    }

    // Limpiar formulario vía estado
    setEmail('')
    setPassword('')
    setMensaje({ texto: `Bienvenido/a, ${usuario.nombre}.`, tipo: 'success' })
    setSalidaLogin(`Salida JSON: ${JSON.stringify(datosPublicos)}`)
  }

  return (
    <div className="form-card" id="loginFormCard">
      <h3 id="tituloLogin">Login de usuarios</h3>
      <p className="form-subtitle">Ingresa con tu cuenta registrada.</p>

      <form id="formLogin" noValidate onSubmit={procesarLogin}>
        <div className="form-group">
          <label htmlFor="loginEmail" className="form-label">Correo electrónico</label>
          <input
            id="loginEmail"
            name="loginEmail"
            className={`form-input${mensaje.tipo === 'error' && email.trim() === '' ? ' is-invalid' : ''}`}
            type="email"
            placeholder="tu@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="loginPassword" className="form-label">Contraseña</label>
          <input
            id="loginPassword"
            name="loginPassword"
            className={`form-input${mensaje.tipo === 'error' && password.trim() === '' ? ' is-invalid' : ''}`}
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button className="btn-submit" type="submit" id="btnLogin">Ingresar</button>

        {mensaje.texto && (
          <div
            id="mensajeLogin"
            className={`form-message ${mensaje.tipo}`}
            role="alert"
            aria-live="assertive"
          >
            {mensaje.texto}
          </div>
        )}
      </form>

      <output id="salidaLogin" className="login-output" aria-live="polite">
        {salidaLogin}
      </output>
    </div>
  )
}
