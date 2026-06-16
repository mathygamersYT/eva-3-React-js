import { useState } from 'react'
import { validarDatos } from '../utils/usuarios.js'

// Contacto: formulario independiente del registro/login para separar intenciones del usuario
export default function Contacto() {
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

  function procesarContacto(evento) {
    evento.preventDefault()
    const formulario = evento.target

    const camposAValidar = [
      { valor: formulario.contactoNombre.value, nombre: 'contactoNombre', etiqueta: 'Nombre', tipo: 'text' },
      { valor: formulario.contactoEmail.value, nombre: 'contactoEmail', etiqueta: 'Email', tipo: 'text' },
      { valor: formulario.contactoMensaje.value, nombre: 'contactoMensaje', etiqueta: 'Mensaje', tipo: 'textarea' },
    ]

    const resultado = validarDatos(camposAValidar)

    if (!resultado.valido) {
      setMensaje({ texto: resultado.errores.join(' '), tipo: 'error' })
      return
    }

    formulario.reset()
    setMensaje({ texto: 'Mensaje enviado. Te contactaremos para revisar tu solicitud.', tipo: 'success' })
  }

  return (
    <section id="contact" className="container py-5" tabIndex={-1} aria-label="Contacto">
      <h2>Contacto</h2>
      <p>Escribenos para mas informacion o para solicitar un servicio.</p>
      <form id="formContacto" className="form-card" noValidate onSubmit={procesarContacto}>
        <p className="small-muted">Los campos son obligatorios.</p>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="contactoNombre" className="form-label">Nombre</label>
            <input id="contactoNombre" name="contactoNombre" className="form-control" type="text" placeholder="Tu nombre" />
          </div>
          <div className="col-md-6">
            <label htmlFor="contactoEmail" className="form-label">Email</label>
            <input id="contactoEmail" name="contactoEmail" className="form-control" type="text" placeholder="tu@ejemplo.com" />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor="contactoMensaje" className="form-label">Mensaje</label>
          <textarea
            id="contactoMensaje"
            name="contactoMensaje"
            className="form-control"
            rows={5}
            placeholder="Cuentanos como podemos ayudarte"
          />
        </div>
        <button className="btn btn-accent mt-3" type="submit">Enviar mensaje</button>
        {mensaje.texto && (
          <div id="mensajeContacto" className={`form-message mt-3 ${mensaje.tipo}`} role="alert">
            {mensaje.texto}
          </div>
        )}
      </form>
    </section>
  )
}
