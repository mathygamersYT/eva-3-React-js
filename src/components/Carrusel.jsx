import { useState } from 'react'

const imagenesCarrusel = [
  {
    src: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1400',
    alt: 'Computador gamer con iluminacion RGB y componentes internos visibles',
    titulo: 'PC Gaming Ryzen 7800X3D',
    texto: 'Equipo pensado para baja latencia, alto FPS y juegos competitivos.',
  },
  {
    src: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1400',
    alt: 'Tarjeta grafica moderna instalada en una placa madre',
    titulo: 'Radeon RX 7900 XTX',
    texto: 'GPU de 24 GB de VRAM para gaming 4K, streaming y creacion de contenido.',
  },
  {
    src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1400',
    alt: 'Rack de servidores usado para virtualizacion y redes',
    titulo: 'Homelab Proxmox con Intel 125H',
    texto: 'Nodo eficiente para VMs, contenedores LXC, NAS, monitoreo y laboratorios de red.',
  },
]

// Funcion requerida por la rubrica: cambia el indice y actualiza la interfaz via estado React
export default function Carrusel() {
  const [indice, setIndice] = useState(0)

  function cambiarImagen(direccion) {
    setIndice((prev) => {
      let siguiente = prev + direccion
      if (siguiente < 0) siguiente = imagenesCarrusel.length - 1
      if (siguiente >= imagenesCarrusel.length) siguiente = 0
      return siguiente
    })
  }

  const imagen = imagenesCarrusel[indice]

  return (
    <>
      {/* Carrusel manual: clases visuales de Bootstrap, navegacion controlada por estado React */}
      <div
        className="carousel manual-carousel hero-carousel"
        aria-roledescription="carrusel"
        aria-label="Galeria de hardware"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className="d-block w-100" src={imagen.src} alt={imagen.alt} />
            <div className="carousel-caption">
              <h3>{imagen.titulo}</h3>
              <p>{imagen.texto}</p>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          onClick={() => cambiarImagen(-1)}
          aria-label="Imagen anterior"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          onClick={() => cambiarImagen(1)}
          aria-label="Imagen siguiente"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      {/* Indicadores y contador */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="carousel-dots" aria-label="Indicadores del carrusel">
          {imagenesCarrusel.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === indice ? ' active' : ''}`}
              type="button"
              aria-label={`Ir a imagen ${i + 1}`}
              onClick={() => setIndice(i)}
            />
          ))}
        </div>
        <p className="mb-0 small-muted">
          {indice + 1} / {imagenesCarrusel.length}
        </p>
      </div>
    </>
  )
}
