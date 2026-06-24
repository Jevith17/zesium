<br />
<div align="center">
  <a href="https://github.com/Jevith17/zesium">
    <img src="public/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Zesium</h3>

  <p align="center">
    An AI-powered cloud IDE built from scratch — write, preview, and ship code entirely in the browser.
    <br />
  </p>
</div>

## Overview

Zesium is a fully browser-based AI coding environment inspired by tools like Cursor. It combines a real-time collaborative file system, an AI conversation agent with tool execution, live in-browser code previews via WebContainers, and GitHub integration — all wired together with a modern full-stack architecture. No local setup required to run your projects.

## Features

- **AI Code Suggestions** — Ghost text completions powered by Claude/Gemini that appear as you type, with tab-to-accept
- **AI Agent with Tool Execution** — A conversational agent that can create, rename, update, and delete files in a loop until the task is complete
- **Quick Edit** — Select any code, press `Cmd/Ctrl+K`, describe a change, and watch it apply instantly
- **Live Preview** — WebContainers run a full Node.js environment in the browser with real terminal output and hot reload
- **File Explorer** — Recursive, collapsible file/folder tree with VS Code-style icons, context menus, and inline rename
- **Code Editor** — CodeMirror 6 with syntax highlighting for 10+ languages, a minimap, indentation markers, and One Dark theme
- **GitHub Integration** — Import any public or private repository and export your Zesium project to a new GitHub repo
- **Real-time Sync** — Convex's sync engine keeps the file tree, editor, and conversation in sync across tabs with zero polling
- **Conversation History** — Searchable past conversations per project with message cancellation and status tracking
- **Project Creation via Prompt** — Describe what you want to build in plain English and the AI scaffolds the entire project
- **URL Scraping** — Paste a URL into chat or quick edit and Firecrawl scrapes it, feeding live documentation to the AI
- **Error Tracking** — Sentry captures client errors, API errors, background job failures, and AI token usage

## Tech Stack

| Layer                   | Technology                                    |
| ----------------------- | --------------------------------------------- |
| Framework               | Next.js 16 + TypeScript                       |
| Database & Sync         | Convex                                        |
| Authentication          | Clerk                                         |
| Background Jobs & Agent | Inngest + Inngest Agent Kit                   |
| AI Providers            | Anthropic Claude / Google Gemini (via AI SDK) |
| Editor                  | CodeMirror 6                                  |
| In-browser Runtime      | WebContainers                                 |
| Terminal                | Xterm.js                                      |
| Web Scraping            | Firecrawl                                     |
| UI Components           | shadcn/ui + Tailwind CSS                      |
| File Icons              | React Symbols                                 |
| State Management        | Zustand                                       |
| GitHub API              | Octokit                                       |
| Error Tracking          | Sentry                                        |
| Form Handling           | TanStack Form                                 |

## Getting Started

### Prerequisites

- Node.js ≥ 20.9
- npm
- A [Convex](https://convex.dev) account
- A [Clerk](https://clerk.com) account (with GitHub OAuth enabled)
- An [Inngest](https://inngest.com) account
- An [Anthropic](https://console.anthropic.com) or [Google AI Studio](https://aistudio.google.com) API key
- A [Firecrawl](https://firecrawl.dev) API key
- A [Sentry](https://sentry.io) project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/zesium.git
   cd zesium
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Convex**

   ```bash
   npx convex dev
   ```

   Follow the prompts to log in and link or create a Convex project. This will generate your `.env.local` with `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`.

4. **Configure environment variables**

   Create a `.env.local` file at the project root (see [Environment Variables](#environment-variables) below).

5. **Run the development servers**

   You need three terminals running simultaneously:

   ```bash
   # Terminal 1 — Next.js
   npm run dev

   # Terminal 2 — Convex
   npx convex dev

   # Terminal 3 — Inngest local server
   npx --yes inngest-cli@latest dev
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000). Sign in with GitHub via Clerk, create a project, and start building.

## Environment Variables

Create a `.env.local` file in the project root with the following keys:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex (auto-generated by `npx convex dev`)
CONVEX_DEPLOYMENT=dev:...
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud

# Clerk JWT template for Convex auth
# Create a "convex" JWT template in the Clerk dashboard → Sessions → JWT Templates
CLERK_JWT_ISSUER_DOMAIN=https://...clerk.accounts.dev

# Internal key for securing system Convex mutations called from API routes and Inngest
# Set any strong secret string here — must match across all environments
POLARIS_CONVEX_INTERNAL_KEY=your-secret-internal-key

# AI provider — use one or both
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# Firecrawl
FIRECRAWL_KEY=fc-...

# Sentry
SENTRY_AUTH_TOKEN=sntrys_...
```

> **Convex environment variables** — After setting up `.env.local`, copy `CLERK_JWT_ISSUER_DOMAIN`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `POLARIS_CONVEX_INTERNAL_KEY` into your Convex project's environment variables at [dashboard.convex.dev](https://dashboard.convex.dev) → Settings → Environment Variables. Convex cloud functions do not have access to your local `.env.local`.

> **Clerk JWT template** — In the Clerk dashboard go to Sessions → JWT Templates → Add new template → select **Convex**. Do not change the template name. Copy the Issuer URL into `CLERK_JWT_ISSUER_DOMAIN`.

> **GitHub OAuth scope** — In the Clerk dashboard go to Configure → SSO Connections → GitHub → enable custom credentials and add the `repo` scope so users can import and export private repositories.

## Project Structure

```
zesium/
├── app/                        # Next.js App Router pages and API routes
│   └── api/
│       ├── inngest/            # Inngest webhook endpoint
│       ├── messages/           # Send and cancel chat messages
│       ├── github/             # Import, export, cancel, reset
│       ├── projects/           # Create project with prompt
│       └── suggestion/         # Ghost text completions
│           └── quick-edit/     # Inline AI code edits
├── convex/                     # Convex backend (schema, queries, mutations)
│   ├── schema.ts
│   ├── projects.ts
│   ├── files.ts
│   ├── conversations.ts
│   ├── system.ts               # Internal mutations for Inngest ↔ Convex bridge
│   └── auth.config.ts
├── src/
│   ├── components/             # Shared UI components and providers
│   └── features/
│       ├── auth/               # Unauthenticated / loading views
│       ├── conversations/      # Chat sidebar, history, Inngest agent
│       ├── editor/             # CodeMirror setup, extensions, tabs, breadcrumbs
│       ├── preview/            # WebContainer hook, terminal, preview settings
│       └── projects/           # File explorer, navbar, project views, GitHub dialogs
└── public/
```

## License

Distributed under the AGPL-3.0 License. See LICENSE for more information.

## Security

Refer to [SECURITY.md] (./SECURITY.md)
