import { useState } from 'react'
import { validarCampos, limpiarTexto } from '../utils/sanitizar.js'

// ============================================================
// RegistroForm.jsx — Formulario controlado de registro de usuarios
// Cada input está vinculado a su estado (formulario controlado).
// Cada <label> usa htmlFor para asociarse a su input.
// Aplica validaciones por estado y sanitización XSS.
// Recibe handleValidacion y onUsuarioRegistrado vía props.
// ============================================================

export default function RegistroForm({ inscritos, onUsuarioRegistrado, handleValidacion }) {
  // Estado controlado para cada campo del formulario
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [interes, setInteres] = useState('')
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

  function procesarRegistro(evento) {
    evento.preventDefault()

    // Preparar campos para validación
    const camposAValidar = [
      { valor: nombre, nombre: 'registroNombre', etiqueta: 'Nombre completo', tipo: 'text' },
      { valor: email, nombre: 'registroEmail', etiqueta: 'Correo electrónico', tipo: 'email' },
      { valor: password, nombre: 'registroPassword', etiqueta: 'Contraseña', tipo: 'password' },
      { valor: interes, nombre: 'registroInteres', etiqueta: 'Interés principal', tipo: 'select' },
    ]

    // handleValidacion se recibe del padre vía props
    const resultado = handleValidacion(camposAValidar)

    if (!resultado.valido) {
      setMensaje({ texto: resultado.errores.join(' '), tipo: 'error' })
      return
    }

    // Sanitizar antes de almacenar
    const emailLimpio = limpiarTexto(email).toLowerCase()
    const existeUsuario = inscritos.some((u) => u.email === emailLimpio)

    if (existeUsuario) {
      setMensaje({ texto: 'Este correo ya está inscrito.', tipo: 'error' })
      return
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: limpiarTexto(nombre),
      email: emailLimpio,
      password: password.trim(),
      interes: limpiarTexto(interes),
      fechaRegistro: new Date().toLocaleString('es-CL'),
    }

    // Comunicar al padre mediante la prop callback
    onUsuarioRegistrado(nuevoUsuario)

    // Limpiar formulario vía estado (sin manipular el DOM)
    setNombre('')
    setEmail('')
    setPassword('')
    setInteres('')
    setMensaje({ texto: '¡Registro exitoso! Bienvenido/a.', tipo: 'success' })
  }

  return (
    <div className="form-card" id="registroFormCard">
      <h3 id="tituloRegistro">Registro de usuarios</h3>
      <p className="form-subtitle">Crea tu cuenta para acceder a los recursos de IT Progs.</p>

      <form id="formRegistro" noValidate onSubmit={procesarRegistro}>
        <div className="form-group">
          <label htmlFor="registroNombre" className="form-label">Nombre completo</label>
          <input
            id="registroNombre"
            name="registroNombre"
            className={`form-input${mensaje.tipo === 'error' && nombre.trim() === '' ? ' is-invalid' : ''}`}
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="registroEmail" className="form-label">Correo electrónico</label>
          <input
            id="registroEmail"
            name="registroEmail"
            className={`form-input${mensaje.tipo === 'error' && email.trim() === '' ? ' is-invalid' : ''}`}
            type="email"
            placeholder="tu@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="registroPassword" className="form-label">Contraseña</label>
          <input
            id="registroPassword"
            name="registroPassword"
            className={`form-input${mensaje.tipo === 'error' && password.trim() === '' ? ' is-invalid' : ''}`}
            type="password"
            placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 especial"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <span className="form-hint">Requisitos: mínimo 8 caracteres, al menos una mayúscula y un carácter especial.</span>
        </div>

        <div className="form-group">
          <label htmlFor="registroInteres" className="form-label">Interés principal</label>
          <select
            id="registroInteres"
            name="registroInteres"
            className="form-input form-select"
            value={interes}
            onChange={(e) => setInteres(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Desarrollo web">Desarrollo web</option>
            <option value="Soporte técnico">Soporte técnico</option>
            <option value="Ryzen 7800X3D y RX 7900 XTX">Ryzen 7800X3D y RX 7900 XTX</option>
            <option value="Proxmox con Intel 125H">Proxmox con Intel 125H</option>
          </select>
        </div>

        <button className="btn-submit" type="submit" id="btnRegistro">Crear usuario</button>

        {mensaje.texto && (
          <div
            id="mensajeRegistro"
            className={`form-message ${mensaje.tipo}`}
            role="alert"
            aria-live="assertive"
          >
            {mensaje.texto}
          </div>
        )}
      </form>
    </div>
  )
}
