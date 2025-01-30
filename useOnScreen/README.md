# React OnScreen Hook

A React hook for detecting when an element enters or leaves the viewport with TypeScript support and IntersectionObserver API.

## Installation

```bash
npm install @noeg/useonscreen
# or
yarn add @noeg/useonscreen
# or
pnpm add @noeg/useonscreen
```

## Features

- 👀 Detect element visibility in viewport
- 🎯 Uses IntersectionObserver API
- ⚡️ Optimized performance with zero dependencies
- 🛡️ Type-safe with TypeScript
- 🧪 Well tested
- 🎨 Perfect for animations and lazy loading

## Usage

```typescript
import { useOnScreen } from '@noeg/useonscreen'
import { useRef } from 'react'

function LazyLoadedContent() {
  const elementRef = useRef<HTMLDivElement>(null)
  // Basic usage with default options
  const isVisible = useOnScreen(elementRef)

  return (
    <div ref={elementRef}>
      {isVisible ? 'Element is visible!' : 'Element is not visible'}
    </div>
  )
}

function AdvancedAnimation() {
  const elementRef = useRef<HTMLDivElement>(null)
  // Advanced usage with custom rootMargin and threshold
  const isVisible = useOnScreen(elementRef, '-50px', 0.5)

  return (
    <div
      ref={elementRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      I'll fade in when 50% visible!
    </div>
  )
}
```

## API Reference

```typescript
function useOnScreen(
  ref: RefObject<HTMLDivElement>,
  rootMargin?: string,
  threshold?: number
): boolean
```

### Parameters

| Parameter    | Type                        | Default  | Description                                              |
| ------------ | --------------------------- | -------- | -------------------------------------------------------- |
| `ref`        | `RefObject<HTMLDivElement>` | Required | React ref object attached to the element to observe      |
| `rootMargin` | `string`                    | `'0px'`  | Margin around the root similar to CSS margin property    |
| `threshold`  | `number`                    | `0`      | Percentage of element visibility to trigger (0.0 to 1.0) |

### Returns

Returns a boolean value:

- `true`: Element is visible in the viewport (according to threshold)
- `false`: Element is not visible in the viewport

## Features in Detail

### IntersectionObserver API

The hook uses the modern IntersectionObserver API for optimal performance:

```typescript
function ScrollAnimation() {
  const elementRef = useRef<HTMLDivElement>(null)
  const isVisible = useOnScreen(elementRef)

  return (
    <div
      ref={elementRef}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.5s ease-in-out',
      }}
    >
      I'll animate when I enter the viewport!
    </div>
  )
}
```

### Custom Root Margin

You can control when the element is considered "visible" before it enters the viewport:

```typescript
function EarlyTrigger() {
  const elementRef = useRef<HTMLDivElement>(null)
  // Element will be considered visible 100px before it enters the viewport
  const isVisible = useOnScreen(elementRef, '100px')

  return <div ref={elementRef}>I'll trigger early!</div>
}
```

### Threshold Control

Fine-tune how much of the element needs to be visible:

```typescript
function PartialVisibility() {
  const elementRef = useRef<HTMLDivElement>(null)
  // Element will be considered visible when 75% is in view
  const isVisible = useOnScreen(elementRef, '0px', 0.75)

  return <div ref={elementRef}>I need to be 75% visible!</div>
}
```

## Best Practices

- Use appropriate thresholds for your use case
- Consider performance when observing many elements
- Use rootMargin wisely for preloading content
- Clean up observers when components unmount (handled automatically)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
