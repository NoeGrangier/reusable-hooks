# React LocalStorage Hook

A React hook for persisting state in localStorage with TypeScript support and syncing across tabs/windows.

## Installation

```bash
npm install @noeg/uselocalstorage
# or
yarn add @noeg/uselocalstorage
# or
pnpm add @noeg/uselocalstorage
```

## Features

- 💾 Persist state in localStorage
- 🔄 Sync state across tabs/windows
- 🎯 Same API as useState
- ⚡️ Optimized performance
- 🛡️ Type-safe with TypeScript
- 🧪 Well tested
- 🌐 SSR friendly

## Usage

```typescript
import { useLocalStorage } from '@noeg/uselocalstorage'

function ThemeToggle() {
  // Works just like useState but persists to localStorage
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  )
}

function UserPreferences() {
  // Works with complex objects
  const [preferences, setPreferences] = useLocalStorage('preferences', {
    notifications: true,
    fontSize: 14,
    colorScheme: 'auto',
  })

  // Can use functional updates just like useState
  const toggleNotifications = () => {
    setPreferences((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }))
  }

  return (
    <div>
      <button onClick={toggleNotifications}>
        Notifications: {preferences.notifications ? 'On' : 'Off'}
      </button>
    </div>
  )
}
```

## API Reference

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((val: T) => T)) => void]
```

### Parameters

| Parameter      | Type             | Description                                                |
| -------------- | ---------------- | ---------------------------------------------------------- |
| `key`          | `string`         | The key to store the value under in localStorage           |
| `initialValue` | `T \| (() => T)` | The initial value or a function that returns initial value |

### Returns

Returns a tuple of `[storedValue, setValue]`, just like React's `useState`:

- `storedValue`: The current value (from localStorage if available, otherwise initialValue)
- `setValue`: A function to update the value (persists to localStorage automatically)

## Features in Detail

### Lazy Initial Value

You can pass a function as the initial value, which will only be executed once:

```typescript
const [value, setValue] = useLocalStorage('key', () => {
  // This expensive computation only runs once
  return expensiveComputation()
})
```

### Cross-Tab Synchronization

The hook automatically syncs state across tabs/windows:

```typescript
function MultiTabDemo() {
  const [count, setCount] = useLocalStorage('count', 0)

  // When you update count in one tab, it updates in all tabs
  return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
}
```

### Type Safety

The hook is fully typed and will infer the correct types from your initial value:

```typescript
interface User {
  name: string
  age: number
}

// userData and setUserData are properly typed
const [userData, setUserData] = useLocalStorage<User>('user', {
  name: 'John',
  age: 30,
})
```

### Error Handling

The hook handles errors gracefully:

- Falls back to initial value if localStorage is unavailable
- Handles JSON parsing errors
- Works in SSR environments
- Provides console warnings for debugging

## Best Practices

- Use meaningful keys to avoid conflicts
- Store minimal necessary data
- Consider using a prefix for your app's keys
- Be mindful of localStorage size limits
- Use JSON-serializable values

## License

This project is licensed under the [Unlicense](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
