import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import { useTheme } from '../src/hook'
import { ThemeProvider } from '../src/provider'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

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
    localStorageMock.clear()
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
    localStorageMock.setItem('vite-ui-theme', 'dark')

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
    expect(localStorageMock.getItem('vite-ui-theme')).toBe('dark')
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

    expect(localStorageMock.getItem('custom-theme-key')).toBe('dark')
  })

  it('should use custom default theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }: any) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      ),
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBeTruthy()
  })
})
