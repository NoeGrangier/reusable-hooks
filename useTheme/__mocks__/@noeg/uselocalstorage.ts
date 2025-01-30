import { useState } from 'react'

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value
      setState(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      console.error('Error setting localStorage value')
    }
  }

  return [state, setValue] as const
} 
