# usePolling

A React hook for implementing polling functionality with configurable intervals, conditions, and callbacks.

## Installation

```bash
npm install @noeg/usepolling
# or
yarn add @noeg/usepolling
# or
pnpm add @noeg/usepolling
```

## Features

- 🔄 Automatic polling with configurable intervals
- ⏱️ Customizable polling conditions
- 🎯 Success and error callbacks
- ⚡ Immediate or delayed start options
- 🛑 Manual control over polling (start/stop)
- 💪 TypeScript support

## Usage

```typescript
import { usePolling } from '@noeg/usepolling'

function MyComponent() {
  const { data, error, isLoading, startPolling, stopPolling } = usePolling({
    // Required: Function that returns a Promise
    fetcher: async () => {
      const response = await fetch('https://api.example.com/data')
      return response.json()
    },

    // Optional: Polling interval in milliseconds (default: 5000)
    interval: 3000,

    // Optional: Condition to stop polling (default: () => false)
    condition: (data) => data.status === 'completed',

    // Optional: Success callback
    onSuccess: (data) => {
      console.log('Data received:', data)
    },

    // Optional: Error callback
    onError: (error) => {
      console.error('Polling failed:', error)
    },

    // Optional: Start polling immediately (default: true)
    immediate: true,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={startPolling}>Start Polling</button>
      <button onClick={stopPolling}>Stop Polling</button>
    </div>
  )
}
```

## API Reference

### Options

| Option      | Type                     | Required | Default       | Description                                  |
| ----------- | ------------------------ | -------- | ------------- | -------------------------------------------- |
| `fetcher`   | `() => Promise<T>`       | Yes      | -             | Async function that fetches data             |
| `interval`  | `number`                 | No       | `5000`        | Polling interval in milliseconds             |
| `condition` | `(data: T) => boolean`   | No       | `() => false` | Function to determine when to stop polling   |
| `onSuccess` | `(data: T) => void`      | No       | -             | Callback function called on successful fetch |
| `onError`   | `(error: Error) => void` | No       | -             | Callback function called on fetch error      |
| `immediate` | `boolean`                | No       | `true`        | Whether to start polling immediately         |

### Return Value

| Property       | Type            | Description                               |
| -------------- | --------------- | ----------------------------------------- |
| `data`         | `T \| null`     | The latest data received from the fetcher |
| `error`        | `Error \| null` | Error object if the last fetch failed     |
| `isLoading`    | `boolean`       | Whether a fetch is in progress            |
| `startPolling` | `() => void`    | Function to manually start polling        |
| `stopPolling`  | `() => void`    | Function to manually stop polling         |

## License

This project is licensed under the [Unlicense](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
