// Modelo simple de usuario
export class Usuario {
  constructor(nombre, email, password, interes) {
    this.id = Date.now();
    this.nombre = nombre;
    this.email = email.toLowerCase();
    this.password = password;
    this.interes = interes;
    this.fechaRegistro = new Date().toLocaleString('es-CL');
  }
}

const API_USUARIOS = '/api/usuarios';
const STORAGE_KEY = 'itProgsUsuarios';

// Entrada de datos: carga desde API o localStorage como respaldo
export async function cargarUsuarios() {
  try {
    const respuesta = await fetch(API_USUARIOS, { cache: 'no-store' });
    if (!respuesta.ok) throw new Error('No se pudo leer usuarios desde el servidor.');
    return await respuesta.json();
  } catch {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }
}

// Salida de datos: guarda en API o localStorage como respaldo
export async function guardarUsuario(nuevoUsuario) {
  try {
    const respuesta = await fetch(API_USUARIOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoUsuario),
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudo guardar el usuario.');
    return datos;
  } catch {
    guardarEnLocalStorage(nuevoUsuario);
    return nuevoUsuario;
  }
}

function guardarEnLocalStorage(nuevoUsuario) {
  const usuariosLocales = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (usuariosLocales.some((u) => u.email === nuevoUsuario.email)) {
    throw new Error('Este correo ya esta inscrito.');
  }
  usuariosLocales.push(nuevoUsuario);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosLocales));
}

// Validación manual sin depender solo de HTML5
export function validarDatos(campos) {
  const errores = [];
  const emailRegex = /^(?!.*\.\.)(?!.*[<>"'`;])([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}$/;
  const textoPeligrosoRegex = /<[^>]*>|javascript:|onerror=|onload=|script/gi;

  campos.forEach(({ valor, nombre, etiqueta, tipo }) => {
    const val = valor.trim();

    if (val === '') {
      errores.push(`${etiqueta} no puede estar vacio.`);
      return;
    }

    if (nombre.toLowerCase().includes('email') && !emailRegex.test(val)) {
      errores.push(`${etiqueta} debe tener un formato de correo valido.`);
    }

    if (textoPeligrosoRegex.test(val)) {
      errores.push(`${etiqueta} contiene texto no permitido por seguridad.`);
    }
    textoPeligrosoRegex.lastIndex = 0;

    if (tipo === 'password') {
      const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>\/\?\\|`~]).{8,}$/;
      if (!pwdRegex.test(val)) {
        errores.push('La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.');
      }
    }
  });

  return { valido: errores.length === 0, errores };
}

export function limpiarTexto(texto) {
  return texto.trim().replace(/[<>]/g, '');
}

// Evita mostrar la contraseña en salidas del login
export function sinPassword(usuario) {
  const { password, ...datosPublicos } = usuario;
  return datosPublicos;
}
