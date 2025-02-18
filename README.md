# React Hooks Collection

A collection of useful React hooks for common use cases. Each hook is published as a separate npm package for easy installation and minimal bundle size.

## Publishing

The repository includes two scripts for publishing packages to npm:

### Publishing a Single Package

Use `publish-package.sh` to publish a single package:

```bash
# Publish under the original @noeg namespace
./publish-package.sh useDebounce

# Publish under your own npm username
./publish-package.sh useDebounce your-username
```

### Publishing All Packages

Use `publish-all.sh` to publish all hooks at once:

```bash
# Publish all packages under the original @noeg namespace
./publish-all.sh

# Publish all packages under your own npm username
./publish-all.sh your-username
```

Both scripts will temporarily modify the package.json files to use your npm username instead of @noeg when a username is provided, publish the packages, then restore the original package.json files.

You can use `-h` or `--help` with either script to see usage instructions.

## Available Hooks

### [useDebounce](./useDebounce)

<details>
<summary>Details</summary>

A React hook for debouncing values and functions to optimize performance and limit the rate of executions.

- 🎯 Debounce values or functions
- ⚡️ Optimized performance
- 🔄 Automatic cleanup
- ⏱️ Configurable delay
- 💪 TypeScript support
- 🧪 Well tested
</details>

### [useLocalStorage](./useLocalStorage)

<details>
<summary>Details</summary>

A React hook for persisting state in localStorage with TypeScript support and syncing across tabs/windows.

- 💾 Persist state in localStorage
- 🔄 Sync state across tabs/windows
- 🎯 Same API as useState
- ⚡️ Optimized performance
- 🛡️ Type-safe with TypeScript
- 🧪 Well tested
- 🌐 SSR friendly
</details>

### [useOnScreen](./useOnScreen)

<details>
<summary>Details</summary>

A React hook for detecting when an element enters or leaves the viewport with TypeScript support and IntersectionObserver API.

- 🔄 Automatic polling with configurable intervals
- ⏱️ Customizable polling conditions
- 🎯 Success and error callbacks
- ⚡ Immediate or delayed start options
- 🛑 Manual control over polling (start/stop)
- 💪 TypeScript support
</details>

### [usePolling](./usePolling)

<details>
<summary>Details</summary>

A React hook for implementing polling functionality with configurable intervals, conditions, and callbacks.

- 🔄 Automatic polling with configurable intervals
- ⏱️ Customizable polling conditions
- 🎯 Success and error callbacks
- ⚡ Immediate or delayed start options
- 🛑 Manual control over polling (start/stop)
- 💪 TypeScript support
</details>

### [useScrollable](./useScrollable)

<details>
<summary>Details</summary>

A React hook for managing scrollable containers with TypeScript support, providing scroll position tracking and automatic scroll-to-bottom functionality.

- 📜 Track scroll position (top, middle, bottom)
- 🔄 Automatic scroll-to-bottom functionality
- 📏 Detect if content is scrollable
- ⚡️ Optimized performance with ResizeObserver
- 🛡️ Type-safe with TypeScript
- 🧪 Well tested
- 💬 Perfect for chat applications and infinite scrolling lists
</details>

### [useTheme](./useTheme)

<details>
<summary>Details</summary>

A React hook for implementing theme management with support for light, dark, and system themes.

- 🌓 Support for light and dark themes
- 🖥️ System theme detection and synchronization
- 💾 Persistent theme storage
- 🔄 Automatic theme switching
- 🎨 CSS class-based theming
- 💪 TypeScript support
</details>

## License

This project is licensed under the [Unlicense](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
