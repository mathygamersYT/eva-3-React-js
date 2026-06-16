// Tabla de recursos utiles para reforzar el objetivo original del sitio
const filas = [
  [
    { nombre: 'GitHub', url: 'https://github.com' },
    { nombre: 'GitLab', url: 'https://gitlab.com' },
    { nombre: 'Bitbucket', url: 'https://bitbucket.org' },
  ],
  [
    { nombre: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
    { nombre: 'Stack Overflow', url: 'https://stackoverflow.com' },
    { nombre: 'DEV Community', url: 'https://dev.to' },
  ],
  [
    { nombre: 'Proxmox', url: 'https://www.proxmox.com' },
    { nombre: 'Docker', url: 'https://www.docker.com' },
    { nombre: 'AWS', url: 'https://aws.amazon.com/es/' },
  ],
]

export default function TablaUtilidades() {
  return (
    <section id="links" className="container py-5" tabIndex={-1} aria-label="Enlaces rapidos">
      <h2>Tabla de utilidades</h2>
      <p className="small-muted">Haz clic en cualquiera para abrir el recurso en una nueva pestana.</p>
      <div className="table-responsive">
        <table className="table utility-table align-middle">
          <tbody>
            {filas.map((fila, i) => (
              <tr key={i}>
                {fila.map((enlace) => (
                  <td key={enlace.nombre}>
                    <a href={enlace.url} target="_blank" rel="noopener">
                      {enlace.nombre}
                    </a>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
