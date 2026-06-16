import { useState, useEffect } from 'react'
import { cargarUsuarios } from './utils/usuarios.js'
import Carrusel from './components/Carrusel.jsx'
import PopupLogin from './components/PopupLogin.jsx'
import PopupRegistro from './components/PopupRegistro.jsx'
import Servicios from './components/Servicios.jsx'
import TablaUtilidades from './components/TablaUtilidades.jsx'
import SobreNosotros from './components/SobreNosotros.jsx'
import Contacto from './components/Contacto.jsx'

export default function App() {
  const [loginAbierto, setLoginAbierto] = useState(false)
  const [registroAbierto, setRegistroAbierto] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [usuarios, setUsuarios] = useState([])

  // Punto de arranque: cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios().then(setUsuarios)
  }, [])

  // Cierra popups con Escape
  useEffect(() => {
    function handleKeyDown(evento) {
      if (evento.key === 'Escape') {
        setLoginAbierto(false)
        setRegistroAbierto(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleUsuarioRegistrado(nuevoUsuario) {
    setUsuarios((prev) => [...prev, nuevoUsuario])
  }

  return (
    <>
      {/* Header fijo del sitio: mantiene la identidad IT Progs visible */}
      <header className="site-header sticky-top">
        <nav className="navbar navbar-expand-lg navbar-dark" aria-label="Principal">
          <div className="container">
            <a className="navbar-brand fw-bold" href="#hero">IT Progs</a>

            {/* Registro y Login se dejaron como botones directos */}
            <div className="nav-actions ms-auto order-lg-3">
              <button
                className="btn btn-outline-light btn-sm"
                id="abrirRegistro"
                type="button"
                onClick={() => setRegistroAbierto(true)}
              >
                Registro
              </button>
              <button
                className="btn btn-accent btn-sm"
                id="abrirLogin"
                type="button"
                onClick={() => setLoginAbierto(true)}
              >
                Login
              </button>
            </div>

            <button
              className="navbar-toggler ms-2 order-lg-4"
              id="menuButton"
              type="button"
              aria-controls="mainMenu"
              aria-expanded={menuAbierto}
              aria-label="Mostrar menu"
              onClick={() => setMenuAbierto((prev) => !prev)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse${menuAbierto ? ' show' : ''}`} id="mainMenu">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="#hero" onClick={() => setMenuAbierto(false)}>Inicio</a></li>
                <li className="nav-item"><a className="nav-link" href="#features" onClick={() => setMenuAbierto(false)}>Servicios</a></li>
                <li className="nav-item"><a className="nav-link" href="#links" onClick={() => setMenuAbierto(false)}>Enlaces</a></li>
                <li className="nav-item"><a className="nav-link" href="#contact" onClick={() => setMenuAbierto(false)}>Contacto</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Popup de login: fuera del main para funcionar como capa flotante */}
      <PopupLogin
        isOpen={loginAbierto}
        onClose={() => setLoginAbierto(false)}
        usuarios={usuarios}
      />

      {/* Popup de registro: envia los datos al servidor local */}
      <PopupRegistro
        isOpen={registroAbierto}
        onClose={() => setRegistroAbierto(false)}
        usuarios={usuarios}
        onUsuarioRegistrado={handleUsuarioRegistrado}
      />

      <main>
        {/* Hero principal con carrusel */}
        <section id="hero" className="hero" tabIndex={-1}>
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <p className="small-muted mb-2">Tu puerta de entrada a recursos utiles</p>
                <h1>Bienvenido a IT Progs</h1>
                <p className="lead">
                  Explora nuestras paginas y recursos para desarrollo, soporte, documentacion tecnica
                  y proyectos de infraestructura moderna.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <a className="btn btn-accent" href="#links">Ir a enlaces rapidos</a>
                  <button
                    className="btn btn-outline-light"
                    id="abrirRegistroHero"
                    type="button"
                    onClick={() => setRegistroAbierto(true)}
                  >
                    Crear cuenta
                  </button>
                </div>
              </div>
              <div className="col-lg-6">
                {/* Carrusel manual: navegacion controlada por React */}
                <Carrusel />
              </div>
            </div>
          </div>
        </section>

        {/* Servicios originales de IT Progs */}
        <Servicios />

        {/* Tabla de recursos utiles */}
        <TablaUtilidades />

        {/* Seccion institucional */}
        <SobreNosotros />

        {/* Formulario de contacto independiente */}
        <Contacto />
      </main>

      <footer className="site-footer">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-3">
          <small>© 2026 IT Progs. Todos los derechos reservados.</small>
          <nav aria-label="Redes sociales">
            <ul className="footer-nav">
              <li><a href="https://twitter.com" target="_blank" rel="noopener">Twitter</a></li>
              <li><a href="https://www.facebook.com" target="_blank" rel="noopener">Facebook</a></li>
              <li><a href="https://www.linkedin.com" target="_blank" rel="noopener">LinkedIn</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </>
  )
}
