// Seccion institucional del sitio original
export default function SobreNosotros() {
  return (
    <section id="about" className="container py-5" tabIndex={-1} aria-label="Sobre nosotros">
      <h2>Sobre nosotros</h2>
      <p>
        IT Progs reune recursos, servicios y guias para ayudarte a lanzar y mantener productos digitales,
        con un foco practico en documentacion, soporte e infraestructura.
      </p>
      <img
        src="/images/about-team.jpg"
        alt="Equipo de IT Progs revisando un proyecto en conjunto"
        className="about-img"
      />
    </section>
  )
}
