import { useState, useEffect } from 'react'

// ============================================================
// RecursosView.jsx — Sección de artículos desde la API de Dev.to
// Usa useState para manejar los artículos, estado de carga y errores
// useEffect dispara la petición cada vez que cambia el tagActivo
// ============================================================

const TAGS = [
  { label: 'React', value: 'react' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'CSS', value: 'css' },
  { label: 'HTML', value: 'html' },
  { label: 'Node.js', value: 'node' },
  { label: 'Python', value: 'python' },
]

// Formatea la fecha en español
function formatearFecha(fechaISO) {
  if (!fechaISO) return ''
  const fecha = new Date(fechaISO)
  return fecha.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Componente Skeleton — imita el layout de una tarjeta mientras carga
function ArticuloSkeleton() {
  return (
    <div className="recurso-card recurso-skeleton" aria-hidden="true">
      <div className="skeleton skeleton-img" />
      <div className="recurso-card-body">
        <div className="skeleton skeleton-tag" />
        <div className="skeleton skeleton-titulo" />
        <div className="skeleton skeleton-titulo skeleton-titulo--short" />
        <div className="skeleton skeleton-desc" />
        <div className="skeleton skeleton-desc skeleton-desc--short" />
        <div className="recurso-card-footer">
          <div className="skeleton skeleton-avatar" />
          <div className="skeleton skeleton-autor" />
        </div>
      </div>
    </div>
  )
}

// Componente de tarjeta individual de artículo
function ArticuloCard({ articulo }) {
  const imagenPortada =
    articulo.cover_image ||
    articulo.social_image ||
    `https://dev.to/social_previews/article/${articulo.id}.png`

  return (
    <article className="recurso-card" aria-label={`Artículo: ${articulo.title}`}>
      {/* Imagen de portada */}
      <a
        href={articulo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="recurso-card-img-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="recurso-card-img-wrapper">
          <img
            className="recurso-card-img"
            src={imagenPortada}
            alt={`Portada de ${articulo.title}`}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.classList.add('recurso-card-img-wrapper--fallback')
            }}
          />
          <div className="recurso-card-img-overlay" />
        </div>
      </a>

      {/* Cuerpo de la tarjeta */}
      <div className="recurso-card-body">
        {/* Tags del artículo */}
        {articulo.tag_list && articulo.tag_list.length > 0 && (
          <div className="recurso-tags" aria-label="Etiquetas del artículo">
            {articulo.tag_list.slice(0, 3).map((tag) => (
              <span key={tag} className="recurso-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Título */}
        <h3 className="recurso-titulo">
          <a
            href={articulo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="recurso-titulo-link"
          >
            {articulo.title}
          </a>
        </h3>

        {/* Descripción */}
        {articulo.description && (
          <p className="recurso-descripcion">{articulo.description}</p>
        )}

        {/* Footer de la tarjeta */}
        <div className="recurso-card-footer">
          <div className="recurso-autor">
            {articulo.user?.profile_image_90 && (
              <img
                className="recurso-avatar"
                src={articulo.user.profile_image_90}
                alt={`Avatar de ${articulo.user.name}`}
                loading="lazy"
              />
            )}
            <div className="recurso-autor-info">
              <span className="recurso-autor-nombre">{articulo.user?.name}</span>
              <span className="recurso-autor-fecha">
                {formatearFecha(articulo.published_at)}
              </span>
            </div>
          </div>
          <div className="recurso-meta">
            {articulo.reading_time_minutes > 0 && (
              <span
                className="recurso-lectura"
                title="Tiempo de lectura estimado"
                aria-label={`${articulo.reading_time_minutes} minutos de lectura`}
              >
                ⏱ {articulo.reading_time_minutes} min
              </span>
            )}
            {articulo.positive_reactions_count > 0 && (
              <span
                className="recurso-reacciones"
                title="Reacciones positivas"
                aria-label={`${articulo.positive_reactions_count} reacciones`}
              >
                ❤ {articulo.positive_reactions_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// Componente principal — RecursosView
export default function RecursosView() {
  const [articulos, setArticulos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [tagActivo, setTagActivo] = useState('react')

  // -------------------------------------------------------
  // Efecto: Obtiene artículos de Dev.to cuando cambia el tag
  // -------------------------------------------------------
  useEffect(() => {
    let cancelado = false // Evita actualizaciones de estado en componentes desmontados

    async function fetchArticulos() {
      setCargando(true)
      setError(null)

      try {
        const respuesta = await fetch(
          `https://dev.to/api/articles?tag=${tagActivo}&per_page=6&top=7`
        )

        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: No se pudo conectar con Dev.to`)
        }

        const datos = await respuesta.json()

        if (!cancelado) {
          setArticulos(datos)
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message || 'Ocurrió un error inesperado al cargar los artículos.')
        }
      } finally {
        if (!cancelado) {
          setCargando(false)
        }
      }
    }

    fetchArticulos()

    return () => {
      cancelado = true // Cleanup: cancela si el componente se desmonta antes de completar
    }
  }, [tagActivo])

  // -------------------------------------------------------
  // Manejador de cambio de tag
  // -------------------------------------------------------
  function handleCambioTag(tag) {
    if (tag !== tagActivo) {
      setTagActivo(tag)
    }
  }

  return (
    <section
      id="recursos"
      className="recursos-section"
      aria-label="Recursos y artículos de programación"
    >
      <div className="section-container">
        {/* Encabezado de la sección */}
        <div className="recursos-header">
          <div className="recursos-header-text">
            <span className="hero-badge">Actualizado en tiempo real</span>
            <h2>Recursos & Artículos</h2>
            <p className="section-description">
              Artículos seleccionados de la comunidad{' '}
              <a
                href="https://dev.to"
                target="_blank"
                rel="noopener noreferrer"
                className="recursos-devto-link"
              >
                Dev.to
              </a>{' '}
              sobre las tecnologías más relevantes para desarrolladores.
            </p>
          </div>

          {/* Filtros por Tag */}
          <nav
            className="recursos-filtros"
            aria-label="Filtrar artículos por tecnología"
            role="navigation"
          >
            {TAGS.map((tag) => (
              <button
                key={tag.value}
                id={`filtro-${tag.value}`}
                type="button"
                className={`recurso-filtro-btn${tagActivo === tag.value ? ' activo' : ''}`}
                onClick={() => handleCambioTag(tag.value)}
                aria-pressed={tagActivo === tag.value}
                aria-label={`Ver artículos de ${tag.label}`}
              >
                {tag.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Estado de Error */}
        {error && !cargando && (
          <div className="recursos-error" role="alert" aria-live="assertive">
            <span className="recursos-error-icon">⚠</span>
            <div>
              <strong>No se pudieron cargar los artículos</strong>
              <p>{error}</p>
            </div>
            <button
              type="button"
              className="btn-outline recursos-retry-btn"
              onClick={() => handleCambioTag(tagActivo)}
              aria-label="Intentar cargar los artículos nuevamente"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Grid de Artículos o Skeletons */}
        <div
          className="recursos-grid"
          aria-busy={cargando}
          aria-live="polite"
          aria-label={cargando ? 'Cargando artículos…' : `Artículos sobre ${tagActivo}`}
        >
          {cargando
            ? Array.from({ length: 6 }, (_, i) => <ArticuloSkeleton key={i} />)
            : articulos.map((art) => <ArticuloCard key={art.id} articulo={art} />)}
        </div>

        {/* Sin resultados */}
        {!cargando && !error && articulos.length === 0 && (
          <p className="recursos-vacio" role="status">
            No se encontraron artículos para esta categoría. Intenta con otro filtro.
          </p>
        )}

        {/* Enlace al tag completo en Dev.to */}
        {!cargando && !error && articulos.length > 0 && (
          <div className="recursos-footer">
            <a
              href={`https://dev.to/t/${tagActivo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              aria-label={`Ver todos los artículos de ${tagActivo} en Dev.to`}
            >
              Ver más artículos en Dev.to →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
