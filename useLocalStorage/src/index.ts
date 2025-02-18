import { useEffect, useState } from "react"

/**
 * Hook to persist state in localStorage
 * @param key The key to store the value under in localStorage
 * @param initialValue The initial value (or function that returns the initial value)
 * @returns A tuple of [storedValue, setValue] similar to useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((val: T) => T)) => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  // Update localStorage when state changes
  useEffect(() => {
    try {
      const oldValue = window.localStorage.getItem(key)

      window.localStorage.setItem(key, JSON.stringify(storedValue))

      if (process.env.NODE_ENV !== 'test') {
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: JSON.stringify(storedValue),
          oldValue,
          url: window.location.href,
        }))
      }
    } catch (error) {
      console.warn(`Error saving to localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && (event.newValue && event.newValue !== JSON.stringify(storedValue))) {
        setStoredValue(JSON.parse(event.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setStoredValue]
}
