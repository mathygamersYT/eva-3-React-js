import { useState } from 'react'
import { validarDatos, limpiarTexto, sinPassword } from '../utils/usuarios.js'

// Popup de login: capa flotante para validar credenciales contra usuarios cargados desde JSON
export default function PopupLogin({ isOpen, onClose, usuarios }) {
  const [mensajeLogin, setMensajeLogin] = useState({ texto: '', tipo: '' })
  const [salidaLogin, setSalidaLogin] = useState('Salida: esperando credenciales validas.')

  function procesarLogin(evento) {
    evento.preventDefault()
    const formulario = evento.target

    const camposAValidar = [
      { valor: formulario.loginEmail.value, nombre: 'loginEmail', etiqueta: 'Correo electronico', tipo: 'text' },
      { valor: formulario.loginPassword.value, nombre: 'loginPassword', etiqueta: 'Contrasena', tipo: 'password' },
    ]

    const resultado = validarDatos(camposAValidar)

    if (!resultado.valido) {
      setMensajeLogin({ texto: resultado.errores.join(' '), tipo: 'error' })
      setSalidaLogin('Salida: credenciales rechazadas por validacion.')
      return
    }

    const email = limpiarTexto(formulario.loginEmail.value).toLowerCase()
    const password = formulario.loginPassword.value.trim()
    const usuario = usuarios.find((item) => item.email === email && item.password === password)

    if (!usuario) {
      setMensajeLogin({ texto: 'Credenciales incorrectas o usuario no registrado.', tipo: 'error' })
      setSalidaLogin('Salida: no existe una coincidencia en usuarios.json.')
      return
    }

    formulario.reset()
    setMensajeLogin({ texto: `Bienvenido/a, ${usuario.nombre}.`, tipo: 'success' })
    setSalidaLogin(`Salida JSON: ${JSON.stringify(sinPassword(usuario))}`)
  }

  function handleBackdropClick(evento) {
    if (evento.target === evento.currentTarget) onClose()
  }

  return (
    <section
      className={`login-popup${isOpen ? ' is-open' : ''}`}
      id="loginPopup"
      aria-hidden={!isOpen}
      aria-labelledby="tituloLogin"
      role="dialog"
      onClick={handleBackdropClick}
    >
      <div className="popup-panel">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <p className="small-muted mb-1">Entrada y salida de datos</p>
            <h2 id="tituloLogin">Login de usuarios</h2>
          </div>
          <button
            className="btn-close btn-close-white"
            id="cerrarLogin"
            type="button"
            aria-label="Cerrar login"
            onClick={onClose}
          />
        </div>

        <form id="formLogin" noValidate onSubmit={procesarLogin}>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label">Correo electronico</label>
            <input
              id="loginEmail"
              name="loginEmail"
              className="form-control"
              type="text"
              placeholder="tu@ejemplo.com"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label">Contrasena</label>
            <input
              id="loginPassword"
              name="loginPassword"
              className="form-control"
              type="password"
              placeholder="Tu contrasena"
            />
          </div>
          <button className="btn btn-accent w-100" type="submit">Ingresar</button>
          {mensajeLogin.texto && (
            <div id="mensajeLogin" className={`form-message mt-3 ${mensajeLogin.tipo}`} role="alert">
              {mensajeLogin.texto}
            </div>
          )}
        </form>

        <output id="salidaLogin" className="login-output" aria-live="polite">
          {salidaLogin}
        </output>
      </div>
    </section>
  )
}
