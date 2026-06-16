import { useState } from 'react'
import { validarCampos } from './utils/sanitizar.js'
import Carousel from './components/Carousel.jsx'
import RegistroForm from './components/RegistroForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import ContactoForm from './components/ContactoForm.jsx'

// ============================================================
// App.jsx — Componente principal
// Estructura semántica: <header>, <nav>, <main>, <section>, <footer>
// Estado global: arreglo de inscritos gestionado con useState
// handleValidacion se pasa a los hijos vía props
// Ningún componente hijo modifica el DOM por su cuenta
// ============================================================

export default function App() {
  // Estado global: "lista de inscritos" proveniente del formulario de registro
  const [inscritos, setInscritos] = useState([])

  // Estado de accesibilidad: alto contraste
  const [altoContraste, setAltoContraste] = useState(false)

  // Estado para sección activa en la navegación
  const [seccionActiva, setSeccionActiva] = useState('inicio')

  // -------------------------------------------------------
  // handleValidacion: función manejadora pasada a los hijos
  // Valida campos y devuelve { valido, errores }
  // -------------------------------------------------------
  function handleValidacion(campos) {
    return validarCampos(campos)
  }

  // -------------------------------------------------------
  // handleUsuarioRegistrado: agrega usuario a la lista global
  // Se pasa a RegistroForm vía props
  // -------------------------------------------------------
  function handleUsuarioRegistrado(nuevoUsuario) {
    setInscritos((prev) => [...prev, nuevoUsuario])
  }

  // -------------------------------------------------------
  // Alternar alto contraste con atributo ARIA
  // -------------------------------------------------------
  function toggleAltoContraste() {
    setAltoContraste((prev) => !prev)
  }

  return (
    <div
      className={`app-container${altoContraste ? ' alto-contraste' : ''}`}
      role="application"
      aria-label="IT Progs - Aplicación principal"
    >
      {/* ===================== HEADER ===================== */}
      <header className="site-header">
        <nav className="navbar" aria-label="Navegación principal">
          <div className="nav-inner">
            {/* Logo / Marca */}
            <a className="nav-brand" href="#inicio" onClick={() => setSeccionActiva('inicio')}>
              IT Progs
            </a>

            {/* Enlaces de navegación */}
            <ul className="nav-links" role="menubar">
              <li role="none">
                <a
                  className={`nav-link${seccionActiva === 'inicio' ? ' active' : ''}`}
                  href="#inicio"
                  role="menuitem"
                  onClick={() => setSeccionActiva('inicio')}
                >
                  Inicio
                </a>
              </li>
              <li role="none">
                <a
                  className={`nav-link${seccionActiva === 'registro' ? ' active' : ''}`}
                  href="#registro"
                  role="menuitem"
                  onClick={() => setSeccionActiva('registro')}
                >
                  Registro
                </a>
              </li>
              <li role="none">
                <a
                  className={`nav-link${seccionActiva === 'login' ? ' active' : ''}`}
                  href="#login"
                  role="menuitem"
                  onClick={() => setSeccionActiva('login')}
                >
                  Login
                </a>
              </li>
              <li role="none">
                <a
                  className={`nav-link${seccionActiva === 'contact' ? ' active' : ''}`}
                  href="#contact"
                  role="menuitem"
                  onClick={() => setSeccionActiva('contact')}
                >
                  Contacto
                </a>
              </li>
            </ul>

            {/* Botón ACCESIBILIDAD — parte superior derecha del header */}
            <button
              className={`btn-accesibilidad${altoContraste ? ' activo' : ''}`}
              type="button"
              id="btnAccesibilidad"
              onClick={toggleAltoContraste}
              aria-pressed={altoContraste}
              aria-label={altoContraste ? 'Desactivar alto contraste' : 'Activar alto contraste'}
              title="Alternar modo de alto contraste"
            >
              {altoContraste ? '☀ ACCESIBILIDAD' : '☾ ACCESIBILIDAD'}
            </button>
          </div>
        </nav>
      </header>

      {/* ===================== MAIN ===================== */}
      <main>
        {/* --- Sección Hero con Carrusel --- */}
        <section id="inicio" className="hero-section" aria-label="Inicio">
          <div className="section-container hero-grid">
            <div className="hero-text">
              <span className="hero-badge">Tu puerta de entrada a recursos útiles</span>
              <h1>Bienvenido a IT Progs</h1>
              <p className="hero-description">
                Explora nuestras páginas y recursos para desarrollo, soporte, documentación técnica
                y proyectos de infraestructura moderna.
              </p>
              <div className="hero-actions">
                <a className="btn-primary" href="#registro">Crear cuenta</a>
                <a className="btn-outline" href="#contact">Contacto</a>
              </div>
              {/* Indicador de inscritos */}
              {inscritos.length > 0 && (
                <p className="inscritos-badge" aria-live="polite">
                  👥 {inscritos.length} usuario{inscritos.length !== 1 ? 's' : ''} inscrito{inscritos.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="hero-carousel-wrapper">
              {/* Componente Carousel recibe solo lo necesario */}
              <Carousel />
            </div>
          </div>
        </section>

        {/* --- Sección de Formularios --- */}
        <section id="formularios" className="forms-section" aria-label="Formularios">
          <div className="section-container">
            <h2>Formularios</h2>
            <p className="section-description">Regístrate, inicia sesión o contáctanos.</p>

            <div className="forms-grid">
              {/* RegistroForm: recibe inscritos, onUsuarioRegistrado y handleValidacion */}
              <div id="registro">
                <RegistroForm
                  inscritos={inscritos}
                  onUsuarioRegistrado={handleUsuarioRegistrado}
                  handleValidacion={handleValidacion}
                />
              </div>

              {/* LoginForm: recibe inscritos y handleValidacion */}
              <div id="login">
                <LoginForm
                  inscritos={inscritos}
                  handleValidacion={handleValidacion}
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- Sección de Contacto --- */}
        <ContactoForm handleValidacion={handleValidacion} />

        {/* --- Lista de inscritos (visible si hay registros) --- */}
        {inscritos.length > 0 && (
          <section id="inscritos" className="inscritos-section" aria-label="Lista de inscritos">
            <div className="section-container">
              <h2>Lista de inscritos</h2>
              <p className="section-description">Usuarios registrados mediante el formulario.</p>
              <div className="table-responsive">
                <table className="inscritos-table" aria-label="Tabla de usuarios inscritos">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Email</th>
                      <th scope="col">Interés</th>
                      <th scope="col">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscritos.map((usuario, i) => (
                      <tr key={usuario.id}>
                        <td>{i + 1}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.interes}</td>
                        <td>{usuario.fechaRegistro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="site-footer">
        <section className="footer-info" aria-label="Información académica">
          <div className="section-container footer-content">
            <div className="footer-academic">
              <ul className="footer-data">
                <li><strong>Sección:</strong> FB50</li>
                <li><strong>Nombre alumno:</strong> Mathias Ernesto Moreno De Pujadas</li>
                <li><strong>Nombre profesor:</strong> Víctor Armando Vásquez Muñoz</li>
                <li><strong>Asignatura:</strong> Programación Front End</li>
              </ul>
            </div>
            <div className="footer-brand">
              <p>© 2026 IT Progs. Todos los derechos reservados.</p>
            </div>
          </div>
        </section>
      </footer>
    </div>
  )
}
