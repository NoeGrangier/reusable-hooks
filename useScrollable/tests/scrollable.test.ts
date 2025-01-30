import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import useScrollable, { ScrollPosition } from '../src'

// Mock console.error to suppress expected ref null messages
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('useScrollable: content or container ref is null')) return
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

describe('useScrollable', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useScrollable())

    expect(result.current.isScrollable).toBe(false)
    expect(result.current.scrollPosition).toBe(ScrollPosition.Top)
    expect(result.current.containerRef.current).toBeNull()
    expect(result.current.contentRef.current).toBeNull()
  })

  it('should handle scroll events correctly', () => {
    const { result } = renderHook(() => useScrollable())

    // Mock scroll event data
    const mockEvent = {
      currentTarget: {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 500
      }
    }

    // Test scroll to top
    act(() => {
      result.current.handleScroll(mockEvent as any)
    })
    expect(result.current.scrollPosition).toBe(ScrollPosition.Top)

    // Test scroll to middle
    act(() => {
      result.current.handleScroll({
        currentTarget: {
          ...mockEvent.currentTarget,
          scrollTop: 250
        }
      } as any)
    })
    expect(result.current.scrollPosition).toBe(ScrollPosition.Middle)

    // Test scroll to bottom
    act(() => {
      result.current.handleScroll({
        currentTarget: {
          ...mockEvent.currentTarget,
          scrollTop: 500
        }
      } as any)
    })
    expect(result.current.scrollPosition).toBe(ScrollPosition.Bottom)
  })

  it('should handle scrollToBottom', () => {
    const { result } = renderHook(() => useScrollable())
    const mockScrollTo = jest.fn()

    // Mock container ref
    const mockContainer = {
      scrollTo: mockScrollTo,
      scrollHeight: 1000
    }

    // @ts-ignore - Mocking ref
    result.current.containerRef.current = mockContainer

    act(() => {
      result.current.scrollToBottom()
    })

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 1000,
      behavior: 'smooth'
    })
  })
})
