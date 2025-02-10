# useTheme

A React hook for implementing theme management with support for light, dark, and system themes.

## Installation

```bash
npm install @noeg/usetheme
# or
yarn add @noeg/usetheme
# or
pnpm add @noeg/usetheme
```

## Features

- 🌓 Support for light and dark themes
- 🖥️ System theme detection and synchronization
- 💾 Persistent theme storage
- 🔄 Automatic theme switching
- 🎨 CSS class-based theming
- 💪 TypeScript support

## Usage

```typescript
import { ThemeProvider, useTheme } from '@noeg/usetheme'

// Wrap your app with ThemeProvider
function App() {
  return (
    <ThemeProvider
      defaultTheme="system" // Optional: 'light' | 'dark' | 'system'
      storageKey="my-app-theme" // Optional: custom storage key
    >
      <YourApp />
    </ThemeProvider>
  )
}

// Use the hook in your components
function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>System theme: {systemTheme}</p>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

## API Reference

### ThemeProvider Props

| Prop           | Type                            | Default           | Description                                |
| -------------- | ------------------------------- | ----------------- | ------------------------------------------ |
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'`        | Default theme to use                       |
| `storageKey`   | `string`                        | `'vite-ui-theme'` | Local storage key for persisting the theme |
| `children`     | `React.ReactNode`               | -                 | Child components                           |

### useTheme Hook Return Value

| Property      | Type                            | Description                                |
| ------------- | ------------------------------- | ------------------------------------------ |
| `theme`       | `'light' \| 'dark' \| 'system'` | Current theme setting                      |
| `systemTheme` | `'light' \| 'dark'`             | Current system theme (when theme='system') |
| `setTheme`    | `(theme: Theme) => void`        | Function to update the theme               |

## How it Works

The hook automatically:

- Adds appropriate theme classes (`light` or `dark`) to the document root
- Syncs with system theme preferences when set to 'system'
- Persists theme choice in localStorage
- Provides real-time theme updates

## CSS Usage

The theme provider adds either `light` or `dark` class to your document's root element. You can style your application accordingly:

```css
:root.light {
  --background: #ffffff;
  --text: #000000;
}

:root.dark {
  --background: #000000;
  --text: #ffffff;
}
```

## License

This project is licensed under the [Unlicense](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
