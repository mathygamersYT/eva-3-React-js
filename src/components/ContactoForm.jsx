import { useState } from 'react'
import { limpiarTexto } from '../utils/sanitizar.js'

// ============================================================
// ContactoForm.jsx — Formulario controlado de contacto
// Campos: Nombre, Email y Mensaje (según la rúbrica).
// Cada input está vinculado a su estado (formulario controlado).
// Cada <label> usa htmlFor para asociarse a su input.
// Aplica validaciones por estado y sanitización XSS.
// Recibe handleValidacion vía props desde el componente padre.
// ============================================================

export default function ContactoForm({ handleValidacion }) {
  // Estado controlado para cada campo
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensajeTexto, setMensajeTexto] = useState('')
  const [feedback, setFeedback] = useState({ texto: '', tipo: '' })

  function procesarContacto(evento) {
    evento.preventDefault()

    const camposAValidar = [
      { valor: nombre, nombre: 'contactoNombre', etiqueta: 'Nombre', tipo: 'text' },
      { valor: email, nombre: 'contactoEmail', etiqueta: 'Email', tipo: 'email' },
      { valor: mensajeTexto, nombre: 'contactoMensaje', etiqueta: 'Mensaje', tipo: 'textarea' },
    ]

    // handleValidacion se recibe del padre vía props
    const resultado = handleValidacion(camposAValidar)

    if (!resultado.valido) {
      setFeedback({ texto: resultado.errores.join(' '), tipo: 'error' })
      return
    }

    // Sanitizar antes de "enviar"
    const datos = {
      nombre: limpiarTexto(nombre),
      email: limpiarTexto(email).toLowerCase(),
      mensaje: limpiarTexto(mensajeTexto),
    }

    // Aquí se podría enviar `datos` a una API
    console.log('Contacto enviado:', datos)

    // Limpiar formulario vía estado (sin manipular el DOM)
    setNombre('')
    setEmail('')
    setMensajeTexto('')
    setFeedback({ texto: 'Mensaje enviado. Te contactaremos para revisar tu solicitud.', tipo: 'success' })
  }

  return (
    <section id="contact" className="app-section" tabIndex={-1} aria-label="Contacto">
      <div className="section-container">
        <h2>Contacto</h2>
        <p className="section-description">Escríbenos para más información o para solicitar un servicio.</p>

        <div className="form-card" id="contactoFormCard">
          <h3>Formulario de contacto</h3>
          <p className="form-subtitle">Los campos son obligatorios.</p>

          <form id="formContacto" noValidate onSubmit={procesarContacto}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactoNombre" className="form-label">Nombre</label>
                <input
                  id="contactoNombre"
                  name="contactoNombre"
                  className={`form-input${feedback.tipo === 'error' && nombre.trim() === '' ? ' is-invalid' : ''}`}
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactoEmail" className="form-label">Email</label>
                <input
                  id="contactoEmail"
                  name="contactoEmail"
                  className={`form-input${feedback.tipo === 'error' && email.trim() === '' ? ' is-invalid' : ''}`}
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactoMensaje" className="form-label">Mensaje</label>
              <textarea
                id="contactoMensaje"
                name="contactoMensaje"
                className={`form-input form-textarea${feedback.tipo === 'error' && mensajeTexto.trim() === '' ? ' is-invalid' : ''}`}
                rows={5}
                placeholder="Cuéntanos cómo podemos ayudarte"
                value={mensajeTexto}
                onChange={(e) => setMensajeTexto(e.target.value)}
              />
            </div>

            <button className="btn-submit" type="submit" id="btnContacto">Enviar mensaje</button>

            {feedback.texto && (
              <div
                id="mensajeContacto"
                className={`form-message ${feedback.tipo}`}
                role="alert"
                aria-live="assertive"
              >
                {feedback.texto}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
