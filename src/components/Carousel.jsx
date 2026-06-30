import { useState, useEffect } from 'react'

// ============================================================
// Carousel.jsx — Carrusel funcional controlado por estado React
// Usa useState para el índice; la lógica de cambio está aislada
// en la función manejadora handleCambioImagen.
// ============================================================

const imagenesCarrusel = [
  {
    src: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1400',
    alt: 'Computador gamer con iluminación RGB y componentes internos visibles',
    titulo: 'PC Gaming Ryzen 7800X3D',
    texto: 'Equipo pensado para baja latencia, alto FPS y juegos competitivos.',
  },
  {
    src: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1400',
    alt: 'Tarjeta gráfica moderna instalada en una placa madre',
    titulo: 'Radeon RX 7900 XTX',
    texto: 'GPU de 24 GB de VRAM para gaming 4K, streaming y creación de contenido.',
  },
  {
    src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1400',
    alt: 'Rack de servidores usado para virtualización y redes',
    titulo: 'Homelab Proxmox con Intel 125H',
    texto: 'Nodo eficiente para VMs, contenedores LXC, NAS, monitoreo y laboratorios de red.',
  },
]

export default function Carousel() {
  // useState para llevar el índice de la imagen actual
  const [indice, setIndice] = useState(0)

  // Reproducción automática del carrusel cada 5 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      handleCambioImagen(1)
    }, 5000)
    return () => clearInterval(intervalo)
  }, [indice])

  // Función manejadora aislada: handleCambioImagen
  // Recibe una dirección (-1 para anterior, +1 para siguiente)
  // y actualiza el estado con lógica circular
  function handleCambioImagen(direccion) {
    setIndice((prev) => {
      let siguiente = prev + direccion
      if (siguiente < 0) siguiente = imagenesCarrusel.length - 1
      if (siguiente >= imagenesCarrusel.length) siguiente = 0
      return siguiente
    })
  }

  const imagen = imagenesCarrusel[indice]

  return (
    <section
      className="carousel-container"
      aria-roledescription="carrusel"
      aria-label="Galería de hardware"
    >
      {/* Imagen actual del carrusel */}
      <div className="carousel-viewport">
        <img
          className="carousel-img"
          src={imagen.src}
          alt={imagen.alt}
        />
        <div className="carousel-caption-overlay">
          <h3>{imagen.titulo}</h3>
          <p>{imagen.texto}</p>
        </div>
      </div>

      {/* Controles: Anterior y Siguiente */}
      <div className="carousel-controls">
        <button
          className="carousel-btn carousel-btn-prev"
          type="button"
          onClick={() => handleCambioImagen(-1)}
          aria-label="Imagen anterior"
        >
          ‹
        </button>
        <button
          className="carousel-btn carousel-btn-next"
          type="button"
          onClick={() => handleCambioImagen(1)}
          aria-label="Imagen siguiente"
        >
          ›
        </button>
      </div>

      {/* Indicadores de punto y contador */}
      <div className="carousel-indicators">
        <div className="carousel-dots" aria-label="Indicadores del carrusel">
          {imagenesCarrusel.map((imagen, i) => (
            <button
              key={imagen.titulo}
              className={`carousel-dot${i === indice ? ' active' : ''}`}
              type="button"
              aria-label={`Ir a imagen ${i + 1}`}
              aria-current={i === indice ? 'true' : undefined}
              onClick={() => setIndice(i)}
            />
          ))}
        </div>
        <span className="carousel-counter">
          {indice + 1} / {imagenesCarrusel.length}
        </span>
      </div>
    </section>
  )
}
