# React Debounce Hooks

A collection of React hooks for debouncing values and functions to optimize performance and limit the rate of executions.

## Installation

```bash
npm install @noeg/usedebounce
# or
yarn add @noeg/usedebounce
# or
pnpm add @noeg/usedebounce
```

## Features

- 🎯 Debounce values or functions
- ⚡️ Optimized performance
- 🔄 Automatic cleanup
- ⏱️ Configurable delay
- 💪 TypeScript support
- 🧪 Well tested

## Usage

### useDebounceValue

Use this hook when you want to debounce a value that changes frequently (e.g., search input, form fields).

```typescript
import { useDebounceValue } from '@noeg/usedebounce'

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500)

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
```

### useDebounceFunction

Use this hook when you want to debounce a function that gets called frequently (e.g., event handlers, API calls).

```typescript
import { useDebounceFunction } from '@noeg/usedebounce'

function AutosaveForm() {
  const save = async (data: FormData) => {
    await api.save(data)
  }

  // Create a debounced version of the save function
  const debouncedSave = useDebounceFunction(save, 1000)

  return (
    <form
      onChange={(e) => {
        const data = new FormData(e.currentTarget)
        // This will only call save() once, 1000ms after the last change
        debouncedSave(data)
      }}
    >
      {/* form fields */}
    </form>
  )
}
```

## API Reference

### useDebounceValue

```typescript
function useDebounceValue<T>(value: T, delay: number): T
```

#### Parameters

| Parameter | Type     | Description               |
| --------- | -------- | ------------------------- |
| `value`   | `T`      | The value to debounce     |
| `delay`   | `number` | The delay in milliseconds |

#### Returns

Returns the debounced value of type `T`.

### useDebounceFunction

```typescript
function useDebounceFunction<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void
```

#### Parameters

| Parameter | Type     | Description               |
| --------- | -------- | ------------------------- |
| `fn`      | `T`      | The function to debounce  |
| `delay`   | `number` | The delay in milliseconds |

#### Returns

Returns a debounced version of the provided function that:

- Has the same parameters as the original function
- Returns void (since it's debounced)
- Will only execute after the specified delay
- Will cancel any pending executions when called again

## Backward Compatibility

For backward compatibility, the default export is an alias for `useDebounceValue`:

```typescript
import { useDebounce } from '@noeg/usedebounce'
// useDebounce is the same as useDebounceValue
```

## Best Practices

### When to use useDebounceValue

- Form inputs that trigger expensive operations
- Search inputs that make API calls
- Window resize or scroll event values
- Any frequently changing value that triggers side effects

### When to use useDebounceFunction

- Event handlers that make API calls
- Save functions for auto-saving forms
- Window resize or scroll event handlers
- Any callback that gets called frequently and needs rate limiting

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
