import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { validarCampos } from './utils/sanitizar.js'
import { Toaster, sileo } from 'sileo'
import Carousel from './components/Carousel.jsx'
import RegistroForm from './components/RegistroForm.jsx'
import EditarRegistroForm from './components/EditarRegistroForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import ContactoForm from './components/ContactoForm.jsx'
import RecursosView from './components/RecursosView.jsx'
import AdminView from './components/AdminView.jsx'
import useLocalStorage from './hooks/useLocalStorage.js'

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
  const [inscritos, setInscritos] = useLocalStorage('inscritos', [])
  const [usuarioActivo, setUsuarioActivo] = useLocalStorage('usuarioActivo', null)
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState(null)

  // Estado de accesibilidad: alto contraste
  const [altoContraste, setAltoContraste] = useState(false)

  function notify({ title, description, state = 'success' }) {
    try {
      if (sileo && typeof sileo[state] === 'function') {
        sileo[state]({ title, description })
        return
      }

      if (sileo && typeof sileo.show === 'function') {
        sileo.show({ title, description, state })
        return
      }
    } catch (error) {
      console.warn('Error mostrando toast con Sileo:', error)
    }

    window.alert(`${title}\n${description}`)
  }

  // -------------------------------------------------------
  // handleUsuarioRegistrado: agrega usuario a la lista global
  // Se pasa a RegistroForm vía props
  // -------------------------------------------------------
  function handleUsuarioRegistrado(nuevoUsuario) {
    setInscritos((prev) => [...prev, nuevoUsuario])
    notify({
      title: 'Registro exitoso',
      description: 'El usuario fue añadido y guardado en localStorage.',
      state: 'success',
    })
  }

  function handleActualizarInscrito(id, datosActualizados) {
    setInscritos((prev) =>
      prev.map((usuario) =>
        usuario.id === id ? { ...usuario, ...datosActualizados } : usuario
      )
    )
    setUsuarioEnEdicion(null)
    notify({
      title: 'Inscrito actualizado',
      description: 'Los cambios se guardaron correctamente.',
      state: 'success',
    })
  }

  function handleEliminarInscrito(id) {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este inscrito?')
    if (!confirmar) return

    setInscritos((prev) => prev.filter((usuario) => usuario.id !== id))

    if (usuarioEnEdicion?.id === id) {
      setUsuarioEnEdicion(null)
    }

    notify({
      title: 'Usuario eliminado',
      description: 'El inscrito fue removido correctamente.',
      state: 'warning',
    })
  }

  function handleEditarSeleccionado(id) {
    const usuario = inscritos.find((item) => item.id === id)
    if (usuario) {
      setUsuarioEnEdicion(usuario)
    }
  }

  function handleCancelarEdicion() {
    setUsuarioEnEdicion(null)
  }

  function handleInicioSesion(usuario) {
    setUsuarioActivo(usuario)
    notify({
      title: 'Inicio de sesión correcto',
      description: `Bienvenido/a ${usuario.nombre}.`,
      state: 'success',
    })
  }

  function handleCerrarSesion() {
    setUsuarioActivo(null)
    notify({
      title: 'Sesión cerrada',
      description: 'Has salido de tu cuenta exitosamente.',
      state: 'info',
    })
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
              {usuarioActivo?.role === 'admin' && (
                <li role="none">
                  <NavLink
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    to="/admin"
                    role="menuitem"
                  >
                    Admin
                  </NavLink>
                </li>
              )}
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

            {usuarioActivo && (
              <div className="nav-user-info" aria-label="Usuario autenticado">
                <span className="nav-user-greeting">Hola, {usuarioActivo.nombre}</span>
                <button
                  type="button"
                  className="btn-outline btn-small"
                  onClick={handleCerrarSesion}
                  aria-label="Cerrar sesión"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
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
                usuarioActivo={usuarioActivo}
                onUsuarioRegistrado={handleUsuarioRegistrado}
                onActualizarInscrito={handleActualizarInscrito}
                onEliminarInscrito={handleEliminarInscrito}
                onEditarSeleccionado={handleEditarSeleccionado}
                usuarioEnEdicion={usuarioEnEdicion}
                onCancelarEdicion={handleCancelarEdicion}
                handleValidacion={handleValidacion}
                notify={notify}
              />
            }
          />

          {/* Ruta Login */}
          <Route
            path="/login"
            element={
              <LoginView
                inscritos={inscritos}
                usuarioActivo={usuarioActivo}
                onLogin={handleInicioSesion}
                onLogout={handleCerrarSesion}
                handleValidacion={handleValidacion}
                notify={notify}
              />
            }
          />

          {/* Ruta Contacto */}
          <Route
            path="/contacto"
            element={<ContactoForm handleValidacion={handleValidacion} notify={notify} />}
          />

          {/* Ruta Recursos — API Dev.to */}
          <Route
            path="/recursos"
            element={<RecursosView />}
          />
          <Route
            path="/admin"
            element={
              <AdminView
                usuarioActivo={usuarioActivo}
                inscritos={inscritos}
                onEditarSeleccionado={handleEditarSeleccionado}
                onEliminarInscrito={handleEliminarInscrito}
              />
            }
          />
        </Routes>
      </main>

      <Toaster position="top-right" theme="dark" />

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

function RegistroView({
  inscritos,
  usuarioActivo,
  onUsuarioRegistrado,
  onActualizarInscrito,
  onEliminarInscrito,
  onEditarSeleccionado,
  usuarioEnEdicion,
  onCancelarEdicion,
  handleValidacion,
  notify,
}) {
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
              notify={notify}
            />
          </div>
        </div>
      </section>

      {usuarioEnEdicion && (
        <section className="forms-section" aria-label="Editar inscrito">
          <div className="section-container">
            <h2>Editar inscrito</h2>
            <p className="section-description">Actualiza los datos del usuario seleccionado.</p>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <EditarRegistroForm
                inscritos={inscritos}
                usuarioId={usuarioEnEdicion.id}
                initialValues={usuarioEnEdicion}
                onUsuarioActualizado={onActualizarInscrito}
                onCancel={onCancelarEdicion}
                handleValidacion={handleValidacion}
                notify={notify}
              />
            </div>
          </div>
        </section>
      )}

      {/* --- Lista de inscritos (visible si hay registros) --- */}
      {usuarioActivo?.role === 'admin' && inscritos.length > 0 && (
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
                <th scope="col">Acciones</th>
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
                      <td className="inscritos-actions-cell">
                        <button
                          type="button"
                          className="btn-outline btn-small"
                          onClick={() => onEditarSeleccionado(usuario.id)}
                          aria-label={`Editar registro de ${usuario.nombre}`}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn-danger btn-small"
                          onClick={() => onEliminarInscrito(usuario.id)}
                          aria-label={`Eliminar registro de ${usuario.nombre}`}
                        >
                          Eliminar
                        </button>
                      </td>
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

function LoginView({ inscritos, usuarioActivo, onLogin, onLogout, handleValidacion, notify }) {
  return (
    <section id="formularios" className="forms-section" aria-label="Formularios">
      <div className="section-container">
        <h2>Acceso</h2>
        <p className="section-description">Inicia sesión con tus credenciales.</p>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {usuarioActivo ? (
            <div className="login-status" aria-live="polite">
              <p className="section-description">
                Has iniciado sesión como <strong>{usuarioActivo.nombre}</strong>.
                {usuarioActivo.role === 'admin' && ' Estás en modo administrador.'}
              </p>
              <button
                type="button"
                className="btn-outline btn-small"
                onClick={onLogout}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <LoginForm
              inscritos={inscritos}
              handleValidacion={handleValidacion}
              onLogin={onLogin}
              notify={notify}
            />
          )}
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
