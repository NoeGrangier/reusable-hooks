import {
  beforeEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import type { RefObject } from 'react'
import { useOnScreen } from '../src'

describe('useOnScreen', () => {
  let mockIntersectionObserver: jest.Mock
  let mockObserverDisconnect: jest.Mock
  let mockObserverObserve: jest.Mock
  let mockObserverUnobserve: jest.Mock
  let intersectionObserverCallback: IntersectionObserverCallback

  beforeEach(() => {
    mockObserverDisconnect = jest.fn()
    mockObserverObserve = jest.fn()
    mockObserverUnobserve = jest.fn()

    // @ts-ignore - Mock implementation works correctly at runtime
    mockIntersectionObserver = jest.fn().mockImplementation((callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
      intersectionObserverCallback = callback
      return {
        disconnect: mockObserverDisconnect,
        observe: mockObserverObserve,
        unobserve: mockObserverUnobserve,
        takeRecords: () => [],
        root: options?.root ?? null,
        rootMargin: options?.rootMargin ?? '0px',
        thresholds: Array.isArray(options?.threshold) ? options.threshold : [options?.threshold ?? 0],
      }
    })

    // @ts-ignore - Mock implementation works correctly at runtime
    global.IntersectionObserver = mockIntersectionObserver
  })

  it('should initialize with isVisible as false', () => {
    const element = document.createElement('div')
    const ref = { current: element } as RefObject<HTMLDivElement>
    const { result } = renderHook(() => useOnScreen(ref), {})

    expect(result.current).toBe(false)
  })

  it('should set up IntersectionObserver with default options', () => {
    const element = document.createElement('div')
    const ref = { current: element } as RefObject<HTMLDivElement>
    renderHook(() => useOnScreen(ref), {})

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        rootMargin: '0px',
        threshold: 0,
      }
    )
    expect(mockObserverObserve).toHaveBeenCalledWith(element)
  })

  it('should set up IntersectionObserver with custom options', () => {
    const element = document.createElement('div')
    const ref = { current: element } as RefObject<HTMLDivElement>
    renderHook(() => useOnScreen(ref, '10px', 0.5))

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        rootMargin: '10px',
        threshold: 0.5,
      }
    )
  })

  it('should update isVisible when intersection changes', () => {
    const element = document.createElement('div')
    const ref = { current: element } as RefObject<HTMLDivElement>
    const { result } = renderHook(() => useOnScreen(ref), {})

    const mockEntry = {
      isIntersecting: true,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 1,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: element,
      time: Date.now()
    }

    act(() => {
      intersectionObserverCallback([mockEntry], {} as IntersectionObserver)
    })
    expect(result.current).toBe(true)

    act(() => {
      intersectionObserverCallback([{ ...mockEntry, isIntersecting: false }], {} as IntersectionObserver)
    })
    expect(result.current).toBe(false)
  })

  it('should not set up observer if ref is null', () => {
    const ref = { current: null } as RefObject<HTMLDivElement | null>
    renderHook(() => useOnScreen(ref))

    expect(mockObserverObserve).not.toHaveBeenCalled()
  })

  it('should clean up observer on unmount', () => {
    const element = document.createElement('div')
    const ref = { current: element } as RefObject<HTMLDivElement>
    const { unmount } = renderHook(() => useOnScreen(ref))

    unmount()
    expect(mockObserverUnobserve).toHaveBeenCalledWith(element)
  })
})
