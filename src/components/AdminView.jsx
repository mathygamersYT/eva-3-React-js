export default function AdminView({ usuarioActivo, inscritos, onEditarSeleccionado, onEliminarInscrito }) {
  if (!usuarioActivo || usuarioActivo.role !== 'admin') {
    return (
      <section className="admin-section" aria-label="Acceso administrativo">
        <div className="section-container">
          <h2>Acceso restringido</h2>
          <p className="section-description">
            Esta sección solo está disponible para el usuario administrador.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-section" aria-label="Panel de administración">
      <div className="section-container">
        <div className="admin-header">
          <h2>Panel de administración</h2>
          <p className="section-description">
            Gestiona los usuarios inscritos desde este panel. Puedes editar o eliminar cualquier registro.
          </p>
        </div>

        {inscritos.length === 0 ? (
          <p>No hay usuarios registrados aún.</p>
        ) : (
          <div className="table-responsive">
            <table className="inscritos-table" aria-label="Tabla de usuarios inscritos">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Email</th>
                  <th scope="col">Interés</th>
                  <th scope="col">Rol</th>
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
                    <td>{usuario.role || 'usuario'}</td>
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
        )}
      </div>
    </section>
  )
}
