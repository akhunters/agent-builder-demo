# Agent Builder Demo

A visual, node-based workflow editor for building AI agents, now powered by React + Vite instead of Next.js.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## 🏗️ Architecture

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: React Router v6 for client-side routing
- **UI Framework**: Tailwind CSS for styling
- **Node Editor**: @xyflow/react for the visual workflow editor
- **State Management**: Zustand for global state
- **Storage**: Browser localStorage and IndexedDB for persistence

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── nodes/          # Custom node components for the workflow editor
│   ├── NodePalette.tsx # Left sidebar for adding nodes
│   ├── NodeConfigPanel.tsx # Right panel for configuring nodes
│   ├── TopBar.tsx      # Top navigation bar
│   └── ...
├── pages/              # Main page components
│   ├── Dashboard.tsx   # Workflow list and management
│   └── Workflow.tsx    # Visual workflow editor
├── lib/                # Utilities and business logic
│   ├── store.ts        # Zustand state management
│   ├── templates.ts    # Pre-built workflow templates
│   └── ...
├── types/              # TypeScript type definitions
└── globals.css         # Global styles and Tailwind utilities
```

## 🎨 Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating AI agent workflows
- **Node Types**: Various node types including Agent, Note, File Search, MCP, If/Else, While loops, etc.
- **Templates**: Pre-built workflow templates for common use cases
- **Real-time Editing**: Changes are auto-saved as you work
- **Responsive Design**: Works on desktop and tablet devices
- **Dark Theme**: Modern dark UI with glass-like effects

## 🔄 Migration from Next.js

This project was converted from Next.js to a standard React application using Vite. Key changes include:

- **Routing**: Converted from Next.js App Router to React Router v6
- **Build System**: Replaced Next.js with Vite for faster builds and HMR
- **Font Loading**: Changed from Next.js font optimization to Google Fonts CDN
- **Project Structure**: Moved from `app/` directory to standard `src/` structure
- **Configuration**: Updated TypeScript, Tailwind, and other configs for Vite

## 🛠️ Development

The project uses modern development tools:

- **Hot Module Replacement (HMR)** with Vite for instant updates
- **TypeScript** for type safety
- **ESLint** for code linting
- **Tailwind CSS** for utility-first styling
- **Plus Jakarta Sans** font from Google Fonts

## 📦 Build Output

The production build creates optimized static files in the `dist/` directory that can be served by any static file server or CDN.