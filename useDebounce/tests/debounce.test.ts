import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import { useDebounceFunction, useDebounceValue } from '../src'

describe('useDebounceValue', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounceValue('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounceValue(value, 500),
      { initialProps: { value: 'initial' } }
    )

    // Update the value
    rerender({ value: 'updated' })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Value should be updated after delay
    expect(result.current).toBe('updated')
  })

  it('should only update once after multiple rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounceValue(value, 500),
      { initialProps: { value: 'initial' } }
    )

    // Update the value 100 times
    for (let i = 0; i < 100; i++) {
      rerender({ value: `update-${i}` })
    }

    // Value should still be initial
    expect(result.current).toBe('initial')

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Should only have the last value
    expect(result.current).toBe('update-99')
  })
})

describe('useDebounceFunction', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('should debounce function calls', () => {
    const mockFn = jest.fn()
    const { result } = renderHook(() => useDebounceFunction(mockFn, 500))

    // Call the debounced function
    result.current('test')

    // Function should not be called immediately
    expect(mockFn).not.toHaveBeenCalled()

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Function should be called after delay
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  it('should only execute once after multiple rapid function calls', () => {
    const mockFn = jest.fn()
    const { result } = renderHook(() => useDebounceFunction(mockFn, 500))

    // Call the debounced function 100 times
    for (let i = 0; i < 100; i++) {
      result.current(`call-${i}`)
    }

    // Function should not be called immediately
    expect(mockFn).not.toHaveBeenCalled()

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Function should only be called once with the last value
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('call-99')
  })

  it('should preserve function arguments', () => {
    const mockFn = jest.fn()
    const { result } = renderHook(() => useDebounceFunction(mockFn, 500))

    // Call with multiple arguments
    result.current('test', 123, { foo: 'bar' })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    // All arguments should be passed correctly
    expect(mockFn).toHaveBeenCalledWith('test', 123, { foo: 'bar' })
  })
})
