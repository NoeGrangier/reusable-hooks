import {
  beforeEach,
  describe,
  expect,
  it
} from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import { useLocalStorage } from '../src'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should initialize with initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('should use existing localStorage value if available', () => {
    localStorage.setItem('key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))
    expect(result.current[0]).toBe('stored')
  })

  it('should update state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(JSON.parse(localStorage.getItem('key')!)).toBe('updated')
  })

  it('should handle objects', () => {
    const { result } = renderHook(() =>
      useLocalStorage('key', { count: 0 })
    )

    act(() => {
      result.current[1]({ count: 1 })
    })

    expect(result.current[0]).toEqual({ count: 1 })
    expect(JSON.parse(localStorage.getItem('key')!)).toEqual({ count: 1 })
  })

  it('should sync state when storage changes in another tab', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'))

    // Simulate storage event from another tab
    act(() => {
      const event = new StorageEvent('storage', {
        key: 'key',
        newValue: JSON.stringify('changed in another tab')
      })
      window.dispatchEvent(event)
    })

    expect(result.current[0]).toBe('changed in another tab')
  })
})
