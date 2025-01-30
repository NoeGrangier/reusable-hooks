# useDebounce

A React hook for debouncing values and functions to optimize performance and limit the rate of executions.

## Installation

```bash
npm install @noeg/usedebounce
# or
yarn add @noeg/usedebounce
# or
pnpm add @noeg/usedebounce
```

## Features

- 🎯 Debounce any value or function
- ⚡️ Optimized performance
- 🔄 Automatic cleanup
- ⏱️ Configurable delay
- 💪 TypeScript support
- 🧪 Well tested

## Usage

```typescript
import { useDebounce } from '@noeg/usedebounce'

// Debouncing a value
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    // This effect will only run 500ms after the last searchTerm change
    console.log('Searching for:', debouncedSearchTerm)
  }, [debouncedSearchTerm])

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}

// Debouncing a function
function ClickHandler() {
  const handleClick = useDebounce((value: string) => {
    console.log('Clicked with value:', value)
  }, 500)

  return (
    <button onClick={() => handleClick('test')}>Click me (debounced)</button>
  )
}
```

## API Reference

### Parameters

| Parameter | Type                      | Description               |
| --------- | ------------------------- | ------------------------- |
| `value`   | `T`                       | The value to debounce     |
| `fn`      | `(...args: any[]) => any` | The function to debounce  |
| `delay`   | `number`                  | The delay in milliseconds |

### Return Value

- When debouncing a value: Returns the debounced value of type `T`
- When debouncing a function: Returns a debounced version of the function

## How it Works

The hook provides two main functionalities:

1. **Value Debouncing**: When you pass a value, it will delay updating the debounced value until the specified delay has passed without any new updates.

2. **Function Debouncing**: When you pass a function, it returns a new function that will only execute after the specified delay has passed since its last invocation.

In both cases, the hook automatically handles cleanup to prevent memory leaks and ensures that only the most recent update is processed.

## Best Practices

- Choose an appropriate delay based on your use case (e.g., 300-500ms for search inputs)
- Use value debouncing for handling frequent state updates
- Use function debouncing for handling frequent event callbacks
- Remember that the debounced function maintains the same dependencies as the original function

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
