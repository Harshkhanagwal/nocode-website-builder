# AI-Powered No-Code Website Builder

Build and customize websites without writing code. This project combines
a visual, section-based website builder with AI-assisted website
generation, allowing users to create a website, customize its
appearance, and publish or preview the result.

> **Project status:** In development. Features and setup instructions
> may change as the application evolves.

## Overview

The AI-Powered No-Code Website Builder is designed to make website
creation accessible to users who do not have frontend development
experience.

Users can create a website through two complementary workflows:

-   **Manual building:** Create a website by adding reusable sections,
    choosing layouts and variants, and customizing content and
    appearance.
-   **AI-assisted generation:** Describe the website they want in a
    prompt and use an LLM-powered workflow to generate a structured
    website configuration.

The application is built around reusable sections and data-driven
configuration. A website's content, theme, typography, and section order
are stored as configuration rather than being hardcoded into a single
page.

## Goals

-   Make website creation possible without writing code.
-   Provide reusable sections and layout variants.
-   Keep website content separate from presentation.
-   Allow users to customize themes and typography.
-   Support AI-assisted generation while retaining manual editing.
-   Build a maintainable foundation that can grow as new sections and
    capabilities are added.

## Features

### Website creation

-   Create a website from the dashboard.
-   Configure a website name and its initial appearance.
-   Associate a website with its owner.
-   Store website configuration for later editing and rendering.

### Visual customization

-   Select from predefined color themes.
-   Select typography presets.
-   Apply design choices through CSS custom properties.
-   Keep styling consistent across website sections.

### Section-based editor

-   Organize a website as a collection of reusable sections.
-   Enable or disable sections.
-   Control section order.
-   Support section-specific content and layout variants.
-   Extend the section registry as new section types are introduced.

### AI-assisted website generation

The planned AI workflow accepts a natural-language description and turns
it into structured website data. That data can be used to populate the
website configuration and render the corresponding sections.

AI generation is intended to complement the manual builder, not replace
the editor.

> Some capabilities may still be under development. Update this section
> as each feature becomes available in the application.

## Technology Stack

  Area                Technology
  ------------------- ---------------------------------
  Frontend            React.js
  Routing             React Router
  State management    Redux Toolkit
  Backend             Node.js, Express.js
  Database            MongoDB, Mongoose
  Authentication      JWT with HTTP-only cookies
  AI integration      LLM APIs and prompt engineering
  Styling             CSS, CSS custom properties
  Development tools   Git, npm, VS Code

## High-Level Architecture

``` text
                         ┌──────────────────────┐
                         │      User            │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │                      │
                         │ Dashboard            │
                         │ Website Editor       │
                         │ Website Renderer     │
                         └──────────┬───────────┘
                                    │
                          HTTP / REST API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Express Backend   │
                         │                      │
                         │ Routes               │
                         │ Controllers          │
                         │ Middleware           │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴──────────────┐
                    ▼                              ▼
          ┌──────────────────┐          ┌──────────────────┐
          │    MongoDB       │          │   LLM Provider   │
          │                  │          │                  │
          │ Users            │          │ AI generation    │
          │ Websites         │          │ Structured data  │
          │ Themes           │          │                  │
          │ Typography       │          └──────────────────┘
          │ Sections         │
          └──────────────────┘
```

### Website rendering flow

1.  The application retrieves the website configuration from the
    backend.
2.  The renderer reads the selected theme and typography.
3.  Design values are applied through CSS custom properties.
4.  Disabled sections are filtered out.
5.  Enabled sections are sorted by their configured order.
6.  The section registry resolves each section to its React component.
7.  The selected variant and section content are passed to the
    component.
8.  The browser renders the assembled website.

## Core Concepts

### Website configuration

A website stores its identity and presentation settings along with its
sections. The configuration is designed to be data-driven so the same
renderer can display different websites.

Conceptually, a website includes:

-   Name and slug
-   Owner
-   Selected color theme
-   Selected typography
-   A collection of sections

### Section architecture

Sections are reusable building blocks. A section configuration can
contain information such as:

  Field           Purpose
  --------------- --------------------------------------------
  `sectionName`   Identifies the section type
  `variant`       Selects the section layout
  `enabled`       Determines whether the section is rendered
  `order`         Determines its position on the page
  `content`       Stores section-specific data

The section registry maps section types to their React components. This
keeps the renderer independent of the implementation details of
individual sections.

### Themes and typography

Themes and typography presets are retrieved from the backend. The
frontend applies the selected values using CSS custom properties,
allowing sections to share the same design system.

## Authentication and API Design

The backend uses Express routes, controllers, and middleware to organize
application logic.

Authentication is designed around JWTs stored in HTTP-only cookies.
Protected routes use authentication middleware, while website-specific
operations also verify that the authenticated user owns the requested
website.

Example API areas:

  Area             Responsibility
  ---------------- ---------------------------------------------
  Authentication   Register, login, current user, logout
  Websites         Create and retrieve website configurations
  Themes           Retrieve available color themes
  Typography       Retrieve available typography presets
  Sections         Create, update, and delete website sections

Exact endpoint paths may differ between development versions. Refer to
the backend route definitions for the current API contract.

## Project Structure

The following is a conceptual structure. Adjust it to match the actual
repository before publishing.

``` text
website-builder/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── colorTheme/
│   │   │   └── typography/
│   │   ├── sections/
│   │   ├── store/
│   │   ├── routes/
│   │   └── styles/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

-   Node.js (LTS recommended)
-   npm
-   MongoDB, either locally or through a hosted MongoDB service
-   An API key for your selected LLM provider if AI functionality is
    enabled

### 1. Clone the repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
```

### 2. Install dependencies

If the repository uses separate frontend and backend packages:

``` bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Create the environment files expected by each application. For example,
the backend may need:

``` env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

# Add the LLM provider key if AI features are enabled
LLM_API_KEY=your_llm_api_key
```

The frontend may need an API base URL, depending on its configuration:

``` env
VITE_API_BASE_URL=http://localhost:3001/api
```

Use the exact variable names referenced by the source code. Never commit
real API keys, database credentials, or JWT secrets.

### 4. Start the backend

``` bash
cd server
npm run dev
```

### 5. Start the frontend

In a separate terminal:

``` bash
cd client
npm run dev
```

Open the local URL printed by the frontend development server.

> The commands above assume a `client` and `server` folder with the
> indicated npm scripts. Update them if your repository uses a different
> structure or script names.

## Security Notes

-   Keep secrets in environment variables.
-   Do not expose private API keys in frontend code.
-   Use HTTP-only cookies for authentication tokens.
-   Validate incoming request data on the backend.
-   Verify website ownership before allowing website modifications.
-   Configure CORS and cookie settings for the intended deployment
    environment.

## Development Roadmap

Potential milestones for the project:

-   [ ] Complete authentication and protected dashboard flows.
-   [ ] Complete website creation and configuration management.
-   [ ] Expand the reusable section library and layout variants.
-   [ ] Complete section editing and ordering workflows.
-   [ ] Improve theme and typography customization.
-   [ ] Integrate the AI website-generation workflow.
-   [ ] Add preview and publishing workflows.
-   [ ] Add automated tests for frontend and backend.
-   [ ] Add deployment configuration and production monitoring.

Update the checklist as features are implemented.

## Contributing

Contributions, suggestions, and bug reports are welcome.

1.  Fork the repository.
2.  Create a feature branch.
3.  Make your changes.
4.  Test the affected functionality.
5.  Open a pull request with a clear description of the changes.

## License

No license has been specified yet. Add a `LICENSE` file before
presenting this project as open source, and update this section with the
chosen license.

------------------------------------------------------------------------

**Built with React, Node.js, MongoDB, and AI.**
