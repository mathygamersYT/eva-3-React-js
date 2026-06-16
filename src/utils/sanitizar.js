// ============================================================
// sanitizar.js — Utilidades de validación y prevención de XSS
// Todas las funciones son puras: reciben datos, devuelven resultados.
// Ninguna manipula el DOM directamente.
// ============================================================

// Regex para detectar inyecciones HTML / JS peligrosas
const PATRON_XSS = /<[^>]*>|javascript:|onerror=|onload=|onclick=|onmouseover=|onfocus=|eval\(|script/gi

// Regex para validar formato de correo electrónico
const PATRON_EMAIL = /^(?!.*\.\.)(?!.*[<>"'`;])([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}$/

/**
 * Sanitiza texto eliminando caracteres HTML peligrosos (<, >, &, ", ')
 * para prevenir ataques XSS. No modifica el DOM; solo devuelve una cadena limpia.
 * @param {string} texto - Texto a sanitizar
 * @returns {string} Texto seguro
 */
export function sanitizarTexto(texto) {
  if (typeof texto !== 'string') return ''
  return texto
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Limpia texto removiendo etiquetas < > directamente.
 * Versión ligera para almacenamiento en estado.
 * @param {string} texto
 * @returns {string}
 */
export function limpiarTexto(texto) {
  if (typeof texto !== 'string') return ''
  return texto.trim().replace(/[<>]/g, '')
}

/**
 * Valida un arreglo de campos y devuelve un objeto con el resultado.
 * Cada campo es un objeto { valor, nombre, etiqueta, tipo }.
 * Soporta tipos: 'text', 'email', 'password', 'textarea', 'select'.
 * @param {Array} campos
 * @returns {{ valido: boolean, errores: string[] }}
 */
export function validarCampos(campos) {
  const errores = []

  campos.forEach(({ valor, nombre, etiqueta, tipo }) => {
    const val = typeof valor === 'string' ? valor.trim() : ''

    // 1. Campo vacío
    if (val === '') {
      errores.push(`${etiqueta} no puede estar vacío.`)
      return
    }

    // 2. Verificar formato de correo si el campo es de tipo email o su nombre lo indica
    if (tipo === 'email' || nombre.toLowerCase().includes('email')) {
      if (!PATRON_EMAIL.test(val)) {
        errores.push(`${etiqueta} debe tener un formato de correo válido.`)
      }
    }

    // 3. Detección de contenido XSS peligroso
    PATRON_XSS.lastIndex = 0
    if (PATRON_XSS.test(val)) {
      errores.push(`${etiqueta} contiene texto no permitido por seguridad.`)
    }

    // 4. Validación de contraseña: mínimo 8 chars, 1 mayúscula, 1 especial
    if (tipo === 'password') {
      const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>\/?\\|`~]).{8,}$/
      if (!pwdRegex.test(val)) {
        errores.push('La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.')
      }
    }
  })

  return { valido: errores.length === 0, errores }
}
