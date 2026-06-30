import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { validarCampos } from './utils/sanitizar.js'
import Carousel from './components/Carousel.jsx'
import RegistroForm from './components/RegistroForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import ContactoForm from './components/ContactoForm.jsx'
import RecursosView from './components/RecursosView.jsx'

// ============================================================
// App.jsx — Componente principal con react-router-dom
// Estructura semántica: <header>, <nav>, <main>, <section>, <footer>
// Estado global: arreglo de inscritos gestionado con useState
// handleValidacion se pasa a los hijos vía props
// Ningún componente hijo modifica el DOM por su cuenta
// ============================================================

// -------------------------------------------------------
// handleValidacion: función pura en módulo — no usa estado ni refs,
// se eleva fuera del componente para evitar recrearse en cada render.
// -------------------------------------------------------
function handleValidacion(campos) {
  return validarCampos(campos)
}

function AppContent() {
  // Estado global: "lista de inscritos" proveniente del formulario de registro
  const [inscritos, setInscritos] = useState([])

  // Estado de accesibilidad: alto contraste
  const [altoContraste, setAltoContraste] = useState(false)

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
            <Link className="nav-brand" to="/">
              IT Progs
            </Link>

            {/* Enlaces de navegación usando NavLink */}
            <ul className="nav-links" role="menubar">
              <li role="none">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/"
                  role="menuitem"
                >
                  Inicio
                </NavLink>
              </li>
              <li role="none">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/registro"
                  role="menuitem"
                >
                  Registro
                </NavLink>
              </li>
              <li role="none">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/login"
                  role="menuitem"
                >
                  Login
                </NavLink>
              </li>
              <li role="none">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/contacto"
                  role="menuitem"
                >
                  Contacto
                </NavLink>
              </li>
              <li role="none">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/recursos"
                  role="menuitem"
                >
                  Recursos
                </NavLink>
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

      {/* ===================== MAIN (Rutas controladas) ===================== */}
      <main>
        <Routes>
          {/* Ruta Inicio */}
          <Route
            path="/"
            element={<HomeView inscritosCount={inscritos.length} />}
          />

          {/* Ruta Registro + Lista de Inscritos */}
          <Route
            path="/registro"
            element={
              <RegistroView
                inscritos={inscritos}
                onUsuarioRegistrado={handleUsuarioRegistrado}
                handleValidacion={handleValidacion}
              />
            }
          />

          {/* Ruta Login */}
          <Route
            path="/login"
            element={
              <LoginView
                inscritos={inscritos}
                handleValidacion={handleValidacion}
              />
            }
          />

          {/* Ruta Contacto */}
          <Route
            path="/contacto"
            element={<ContactoForm handleValidacion={handleValidacion} />}
          />

          {/* Ruta Recursos — API Dev.to */}
          <Route
            path="/recursos"
            element={<RecursosView />}
          />
        </Routes>
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

// -------------------------------------------------------------
// Componentes de Vistas para las Rutas
// -------------------------------------------------------------

function HomeView({ inscritosCount }) {
  return (
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
            <Link className="btn-primary" to="/registro">Crear cuenta</Link>
            <Link className="btn-outline" to="/contacto">Contacto</Link>
          </div>
          {/* Indicador de inscritos */}
          {inscritosCount > 0 && (
            <p className="inscritos-badge" aria-live="polite">
              👥 {inscritosCount} usuario{inscritosCount !== 1 ? 's' : ''} inscrito{inscritosCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="hero-carousel-wrapper">
          <Carousel />
        </div>
      </div>
    </section>
  )
}

function RegistroView({ inscritos, onUsuarioRegistrado, handleValidacion }) {
  return (
    <>
      <section id="formularios" className="forms-section" aria-label="Formularios">
        <div className="section-container">
          <h2>Registro</h2>
          <p className="section-description">Regístrate para inscribirte en la plataforma.</p>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <RegistroForm
              inscritos={inscritos}
              onUsuarioRegistrado={onUsuarioRegistrado}
              handleValidacion={handleValidacion}
            />
          </div>
        </div>
      </section>

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
    </>
  )
}

function LoginView({ inscritos, handleValidacion }) {
  return (
    <section id="formularios" className="forms-section" aria-label="Formularios">
      <div className="section-container">
        <h2>Acceso</h2>
        <p className="section-description">Inicia sesión con tus credenciales.</p>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <LoginForm
            inscritos={inscritos}
            handleValidacion={handleValidacion}
          />
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
