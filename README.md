# OpenAI Agent Builder Replica

A visual node-based workflow builder replica of OpenAI's Agent Builder interface, matching the exact theme and functionality.

## Features

- **Visual Workflow Canvas**: Drag-and-drop nodes onto a canvas to build agent workflows
- **Node Palette**: Categorized nodes (Core, Tools, Logic, Data) in a sidebar
- **Node Types**:
  - **Core**: Start, Agent, End, Note
  - **Tools**: File Search, Guardrails, MCP
  - **Logic**: If/Else, While, User Approval
  - **Data**: Transform, Set State
- **Node Configuration**: Right panel for configuring selected nodes
- **Visual Connections**: Connect nodes visually to create workflows
- **Top Bar**: Workflow name, status, and action buttons (Code, Preview, Deploy)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your OpenAI API key (for future API integration):
```bash
cp .env.local.example .env.local
# Edit .env.local and add your OPENAI_API_KEY
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Add Nodes**: Click on nodes in the left palette or drag them onto the canvas
2. **Connect Nodes**: Click and drag from a node's output handle to another node's input handle
3. **Configure Nodes**: Click on a node to open its configuration panel on the right
4. **Build Workflows**: Create complex agent workflows by connecting multiple nodes
5. **Preview & Deploy**: Use the top bar buttons to preview and deploy your workflows

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Flow (for visual workflow builder)
- OpenAI Assistants API (for backend integration)

## Project Structure

```
├── app/
│   ├── page.tsx              # Main workflow builder page
│   ├── layout.tsx             # Root layout
│   ├── globals.css           # Global styles
│   └── api/                   # API routes for OpenAI integration
├── components/
│   ├── NodePalette.tsx       # Left sidebar with node categories
│   ├── TopBar.tsx            # Top bar with workflow controls
│   ├── NodeConfigPanel.tsx   # Right panel for node configuration
│   └── nodes/                 # Individual node components
│       ├── StartNode.tsx
│       ├── AgentNode.tsx
│       ├── EndNode.tsx
│       ├── GuardrailsNode.tsx
│       ├── IfElseNode.tsx
│       └── ...
└── types/
    └── index.ts               # TypeScript type definitions
```

## Matching OpenAI Agent Builder

This replica matches:
- ✅ Dark theme with black background and subtle grid pattern
- ✅ Node-based visual workflow builder
- ✅ Categorized node palette (Core, Tools, Logic, Data)
- ✅ Node configuration panel on the right
- ✅ Top bar with workflow name, status, and action buttons
- ✅ Visual node connections
- ✅ Drag-and-drop functionality

## Future Enhancements

- Preview functionality with chat interface
- Code export (TypeScript/Python)
- Deploy functionality
- MCP server integration
- Vector store file upload
- Workflow versioning
