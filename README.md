# IT Progs - Evaluación React + Vite

Esta aplicación es una SPA creada con React 19 y Vite 8, que incluye:

- Registro de usuarios con validación y sanitización de inputs.
- Login con sesión persistente en `localStorage`.
- Logout y control de usuario activo.
- Panel de administración para gestionar usuarios inscritos.
- Consumo de API pública Dev.to con estado de carga y manejo de errores.
- Toasts de notificación con `sileo` para eventos importantes.

## Datos de administrador

Para acceder al panel administrativo, utiliza:

- Email: `admin@itprogs.com`
- Contraseña: `Admin123!`

El admin puede:

- Ver la lista completa de inscritos.
- Editar los datos de cualquier usuario.
- Eliminar usuarios registrados.

## Requisitos de uso

1. Instala dependencias:

```bash
npm install
```

2. Inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

3. Abre la URL que muestre Vite, normalmente `http://localhost:5173`.

## Documentación de funcionalidades

### Registro

- El formulario de registro valida campos vacíos, email y contraseña.
- Se sanitizan los valores para evitar inyección XSS.
- El usuario creado se persiste en `localStorage`.

### Login / Logout

- El login valida el usuario contra los inscritos.
- El admin está disponible con credenciales fijas.
- Al cerrar sesión se limpia el estado de usuario activo.

### Administración

- La ruta `/admin` está protegida para usuarios con rol `admin`.
- El menú muestra el enlace `Admin` solo cuando el admin está autenticado.
- La lista de inscritos en la ruta de registro se muestra solo al admin.

### Notificaciones

- La app utiliza `sileo` para mostrar toasts en eventos clave.
- Se notifica registro exitoso, actualización, eliminación, login y logout.

## Dependencias principales

- `react` ^19.2.6
- `react-dom` ^19.2.6
- `react-router-dom` ^7.18.0
- `vite` ^8.0.12
- `sileo` ^0.1.5

## Notas adicionales

- El proyecto incluye validación centralizada en `src/utils/sanitizar.js`.
- El estado de inscritos y la sesión de usuario se guardan en `localStorage` con el hook personalizado `src/hooks/useLocalStorage.js`.
- La app está preparada para producción mediante `npm run build`.
