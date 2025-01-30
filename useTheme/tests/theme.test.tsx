import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import React from 'react'
import { useTheme } from '../src/hook'
import { ThemeProvider } from '../src/provider'

jest.mock('@noeg/uselocalstorage')

let values: Record<string, any> = {}

const localStorageMock = {
  getItem: (key: string): string | null => {
    return values[key] || null
  },
  setItem: (key: string, value: string): void => {
    values[key] = value
  },
  removeItem: (key: string): void => {
    delete values[key]
  },
  clear: (): void => {
    values = {}
  },
}

jest.mock('@noeg/uselocalstorage', () => ({
  useLocalStorage: (key: string, defaultValue: any) => {
    const [state, setState] = React.useState(() => {
      try {
        const item = localStorageMock.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch {
        return defaultValue
      }
    })

    const setValue = (value: any) => {
      try {
        const valueToStore = value instanceof Function ? value(state) : value
        setState(valueToStore)
        localStorageMock.setItem(key, JSON.stringify(valueToStore))
      } catch {
        console.error('Error setting localStorage value')
      }
    }

    return [state, setValue] as const
  },
}))

// Mock matchMedia
const matchMediaMock = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

describe('ThemeProvider and useTheme', () => {
  const wrapper = ({ children, defaultTheme, storageKey }: any) => (
    <ThemeProvider defaultTheme={defaultTheme} storageKey={storageKey}>
      {children}
    </ThemeProvider>
  )

  beforeEach(() => {
    document.documentElement.classList.remove('light', 'dark')
    values = {} // Clear the mock localStorage values
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should throw error when used outside of provider', () => {
    expect(() => {
      renderHook(() => useTheme())
    }).toThrow('useTheme must be used within a ThemeProvider')
  })

  it('should use default theme when no localStorage value exists', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
    })

    expect(result.current.theme).toBe('system')
    expect(document.documentElement.classList.contains('light')).toBeTruthy()
  })

  it('should use theme from localStorage when available', () => {
    localStorageMock.setItem('vite-ui-theme', '"dark"')

    const { result } = renderHook(() => useTheme(), {
      wrapper,
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBeTruthy()
  })

  it('should allow changing theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
    })

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBeTruthy()
    expect(localStorageMock.getItem('vite-ui-theme')).toBe('"dark"')
  })

  it('should handle system theme preference - dark', () => {
    matchMediaMock(true) // Mock system dark mode

    const { result } = renderHook(() => useTheme(), {
      wrapper,
    })

    act(() => {
      result.current.setTheme('system')
    })

    expect(result.current.theme).toBe('system')
    expect(result.current.systemTheme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBeTruthy()
  })

  it('should handle system theme preference - light', () => {
    matchMediaMock(false) // Mock system light mode

    const { result } = renderHook(() => useTheme(), {
      wrapper,
    })

    act(() => {
      result.current.setTheme('system')
    })

    expect(result.current.theme).toBe('system')
    expect(result.current.systemTheme).toBe('light')
    expect(document.documentElement.classList.contains('light')).toBeTruthy()
  })

  it('should use custom storage key', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }: any) => (
        <ThemeProvider storageKey="custom-theme-key">{children}</ThemeProvider>
      ),
    })

    act(() => {
      result.current.setTheme('dark')
    })

    expect(localStorageMock.getItem('custom-theme-key')).toBe('"dark"')
  })

  it('should use custom default theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
      ),
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBeTruthy()
  })
})
