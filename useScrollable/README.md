# React Scrollable Hook

A React hook for managing scrollable containers with TypeScript support, providing scroll position tracking and automatic scroll-to-bottom functionality.

## Installation

```bash
npm install @noeg/usescrollable
# or
yarn add @noeg/usescrollable
# or
pnpm add @noeg/usescrollable
```

## Features

- 📜 Track scroll position (top, middle, bottom)
- 🔄 Automatic scroll-to-bottom functionality
- 📏 Detect if content is scrollable
- ⚡️ Optimized performance with ResizeObserver
- 🛡️ Type-safe with TypeScript
- 🧪 Well tested
- 💬 Perfect for chat applications and infinite scrolling lists

## Usage

```typescript
import { useScrollable } from '@noeg/usescrollable'
import { useEffect } from 'react'

function ChatContainer() {
  const {
    containerRef,
    contentRef,
    isScrollable,
    scrollPosition,
    scrollToBottom,
    handleScroll,
  } = useScrollable()

  // Basic usage
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: '400px', overflow: 'auto' }}
    >
      <div ref={contentRef}>
        {/* Your scrollable content here */}
        {messages.map((message) => (
          <div key={message.id}>{message.text}</div>
        ))}
      </div>
    </div>
  )
}

function AutoScrollChat() {
  const {
    containerRef,
    contentRef,
    scrollPosition,
    scrollToBottom,
    handleScroll,
  } = useScrollable()

  // Automatically scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages.length])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: '400px', overflow: 'auto' }}
    >
      <div ref={contentRef}>
        {messages.map((message) => (
          <div key={message.id}>{message.text}</div>
        ))}
      </div>
    </div>
  )
}
```

## API Reference

```typescript
function useScrollable(): {
  containerRef: RefObject<HTMLDivElement>
  contentRef: RefObject<HTMLDivElement>
  isScrollable: boolean
  scrollPosition: ScrollPosition
  scrollToBottom: () => void
  handleScroll: React.UIEventHandler<HTMLDivElement>
}

enum ScrollPosition {
  None, // Not enough content to scroll
  Top, // Scrolled to top
  Bottom, // Scrolled to bottom
  Middle, // Somewhere in between
}
```

### Returns

| Property       | Type                                 | Description                                          |
| -------------- | ------------------------------------ | ---------------------------------------------------- |
| containerRef   | RefObject<HTMLDivElement>            | Ref for the scrollable container element             |
| contentRef     | RefObject<HTMLDivElement>            | Ref for the content inside the scrollable container  |
| isScrollable   | boolean                              | Whether the content is large enough to be scrollable |
| scrollPosition | ScrollPosition                       | Current scroll position state                        |
| scrollToBottom | () => void                           | Function to smoothly scroll to the bottom            |
| handleScroll   | React.UIEventHandler<HTMLDivElement> | Event handler for scroll events                      |

## Features in Detail

### Scroll Position Tracking

The hook automatically tracks the scroll position:

```typescript
function ScrollTracker() {
  const { containerRef, contentRef, scrollPosition, handleScroll } =
    useScrollable()

  return (
    <div>
      <div>Current position: {ScrollPosition[scrollPosition]}</div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height: '400px', overflow: 'auto' }}
      >
        <div ref={contentRef}>{/* Your content here */}</div>
      </div>
    </div>
  )
}
```

### Automatic Scroll-to-Bottom

Perfect for chat applications or dynamic content:

```typescript
function AutoScrollContent() {
  const { containerRef, contentRef, scrollToBottom, handleScroll } =
    useScrollable()

  useEffect(() => {
    // Call scrollToBottom whenever new content is added
    scrollToBottom()
  }, [contentLength])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: '400px', overflow: 'auto' }}
    >
      <div ref={contentRef}>{/* Dynamic content here */}</div>
    </div>
  )
}
```

## Best Practices

- Always attach both `containerRef` and `contentRef` to their respective elements
- Use the `handleScroll` event handler to track scroll position
- Consider performance when adding or removing content frequently
- Use `isScrollable` to conditionally render scroll-related UI elements
- Call `scrollToBottom` after content updates when needed

## License

This project is licensed under the [Unlicense](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
