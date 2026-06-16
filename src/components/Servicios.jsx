// Servicios originales de IT Progs: se mantienen como cuerpo principal de la landing
const servicios = [
  {
    img: '/images/feature-consultoria.jpg',
    alt: 'Personas revisando una planificacion junto a un laptop',
    titulo: 'Consultoria',
    descripcion: 'Asesoria personalizada para implementar soluciones digitales y mejorar procesos de trabajo.',
  },
  {
    img: '/images/feature-desarrollo.jpg',
    alt: 'Pantalla con codigo en un entorno de desarrollo',
    titulo: 'Desarrollo',
    descripcion: 'Construccion de sitios, aplicaciones y herramientas internas con tecnologias web actuales.',
  },
  {
    img: '/images/feature-soporte.jpg',
    alt: 'Audifonos sobre un escritorio con laptop y monitores',
    titulo: 'Soporte',
    descripcion: 'Mantenimiento, documentacion y acompanamiento para que tus sistemas sigan funcionando.',
  },
]

export default function Servicios() {
  return (
    <section id="features" className="container py-5" tabIndex={-1} aria-label="Servicios principales">
      <h2>Servicios</h2>
      <div className="row g-4">
        {servicios.map((servicio) => (
          <article key={servicio.titulo} className="col-md-4">
            <div className="feature-card h-100">
              <img src={servicio.img} alt={servicio.alt} />
              <h3>{servicio.titulo}</h3>
              <p>{servicio.descripcion}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
