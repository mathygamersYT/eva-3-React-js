import { useState, useEffect } from 'react'

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? initialValue() : initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : typeof initialValue === 'function' ? initialValue() : initialValue
    } catch (error) {
      console.warn(`useLocalStorage: no se pudo leer ${key} de localStorage.`, error)
      return typeof initialValue === 'function' ? initialValue() : initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`useLocalStorage: no se pudo guardar ${key} en localStorage.`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
