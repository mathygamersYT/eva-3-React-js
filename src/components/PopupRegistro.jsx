import { useState } from 'react'
import { Usuario, guardarUsuario, validarDatos, limpiarTexto } from '../utils/usuarios.js'

// Popup de registro: envia los datos al servidor local para actualizar usuarios.json
export default function PopupRegistro({ isOpen, onClose, usuarios, onUsuarioRegistrado }) {
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const [salidaRegistro, setSalidaRegistro] = useState('')

  async function procesarInscripcion(evento) {
    evento.preventDefault()
    const formulario = evento.target

    const camposAValidar = [
      { valor: formulario.registroNombre.value, nombre: 'registroNombre', etiqueta: 'Nombre completo', tipo: 'text' },
      { valor: formulario.registroEmail.value, nombre: 'registroEmail', etiqueta: 'Correo electronico', tipo: 'text' },
      { valor: formulario.registroPassword.value, nombre: 'registroPassword', etiqueta: 'Contrasena', tipo: 'password' },
      { valor: formulario.registroInteres.value, nombre: 'registroInteres', etiqueta: 'Interes principal', tipo: 'select' },
    ]

    const resultado = validarDatos(camposAValidar)

    if (!resultado.valido) {
      setMensaje({ texto: resultado.errores.join(' '), tipo: 'error' })
      setSalidaRegistro('')
      return
    }

    const email = limpiarTexto(formulario.registroEmail.value).toLowerCase()
    const existeUsuario = usuarios.some((u) => u.email === email)

    if (existeUsuario) {
      setMensaje({ texto: 'Este correo ya esta inscrito.', tipo: 'error' })
      setSalidaRegistro('')
      return
    }

    const nuevoUsuario = new Usuario(
      limpiarTexto(formulario.registroNombre.value),
      email,
      formulario.registroPassword.value.trim(),
      limpiarTexto(formulario.registroInteres.value)
    )

    try {
      const usuarioGuardado = await guardarUsuario(nuevoUsuario)
      onUsuarioRegistrado(usuarioGuardado)
      formulario.reset()
      setMensaje({ texto: '', tipo: '' })
      setSalidaRegistro('Registro correcto!')
    } catch (error) {
      setMensaje({ texto: error.message, tipo: 'error' })
      setSalidaRegistro('')
    }
  }

  function handleBackdropClick(evento) {
    if (evento.target === evento.currentTarget) onClose()
  }

  return (
    <section
      className={`login-popup${isOpen ? ' is-open' : ''}`}
      id="registroPopup"
      aria-hidden={!isOpen}
      aria-labelledby="tituloInscripcion"
      role="dialog"
      onClick={handleBackdropClick}
    >
      <div className="popup-panel">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <p className="small-muted mb-1">Crear cuenta</p>
            <h2 id="tituloInscripcion">Registro de usuarios</h2>
          </div>
          <button
            className="btn-close btn-close-white"
            id="cerrarRegistro"
            type="button"
            aria-label="Cerrar registro"
            onClick={onClose}
          />
        </div>

        <form id="formInscripcion" noValidate onSubmit={procesarInscripcion}>
          <div className="mb-3">
            <label htmlFor="registroNombre" className="form-label">Nombre completo</label>
            <input id="registroNombre" name="registroNombre" className="form-control" type="text" placeholder="Tu nombre" />
          </div>
          <div className="mb-3">
            <label htmlFor="registroEmail" className="form-label">Correo electronico</label>
            <input id="registroEmail" name="registroEmail" className="form-control" type="text" placeholder="tu@ejemplo.com" />
          </div>
          <div className="mb-3">
            <label htmlFor="registroPassword" className="form-label">Contrasena</label>
            <input
              id="registroPassword"
              name="registroPassword"
              className="form-control"
              type="password"
              placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 carácter especial"
            />
            <div className="form-text">Requisitos: mínimo 8 caracteres, al menos una mayúscula y un carácter especial.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="registroInteres" className="form-label">Interes principal</label>
            <select id="registroInteres" name="registroInteres" className="form-select">
              <option value="">Selecciona una opcion</option>
              <option value="Desarrollo web">Desarrollo web</option>
              <option value="Soporte tecnico">Soporte tecnico</option>
              <option value="Ryzen 7800X3D y RX 7900 XTX">Ryzen 7800X3D y RX 7900 XTX</option>
              <option value="Proxmox con Intel 125H">Proxmox con Intel 125H</option>
            </select>
          </div>
          <button className="btn btn-accent w-100" type="submit">Crear usuario</button>
          {mensaje.texto && (
            <div id="mensajeInscripcion" className={`form-message mt-3 ${mensaje.tipo}`} role="alert">
              {mensaje.texto}
            </div>
          )}
        </form>

        <p id="salidaRegistro" className="registro-feedback" aria-live="polite">
          {salidaRegistro}
        </p>
      </div>
    </section>
  )
}
