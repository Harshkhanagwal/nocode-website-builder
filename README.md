# AI-Powered No-Code Website Builder

A full-stack website builder that combines a reusable, section-based
visual editor with AI-assisted website generation. The project is
designed to let users create, customize, and render websites through
configuration rather than writing page code.

> **Status:** In development. The repository contains the manual
> website-building workflow and a modular AI generation implementation.
> Feature completeness and deployment instructions may change as
> development continues.

## Overview

The application brings together two website-creation workflows:

-   **Manual creation:** Create a website, choose a color theme and
    typography preset, then add and configure reusable page sections.
-   **AI-assisted creation:** Describe a website in natural language and
    use an LLM-powered generation pipeline to plan the website and
    generate section data.

The generated or manually configured website is represented as
structured data. The frontend renderer uses that configuration to
assemble the page from reusable React components.

## Key Capabilities

### Website management

-   User registration and login.
-   Dashboard for managing website projects.
-   Website configuration and ownership.
-   Website rendering through a public-facing page component.

### Visual website building

-   Create websites with a selected name, theme, and typography.
-   Add and configure sections.
-   Enable, disable, and order sections through website configuration.
-   Reusable section components with multiple layout variants.
-   Theme and typography settings.

### Section library

The frontend currently contains components for these section categories:

  -----------------------------------------------------------------------
  Section category                    Examples visible in the codebase
  ----------------------------------- -----------------------------------
  Header                              Header section

  Hero                                Centered, split, full-screen image,
                                      cinematic corner

  About                               Editorial, minimal typography,
                                      timeline, bento grid

  Accordion / FAQ                     Borderless minimal, dark
                                      futuristic, rounded cards,
                                      two-column FAQ

  Columns                             Bento, classic, people, service
                                      cards

  Contact                             Dark split screen, terminal/code
                                      editor, floating form card, minimal
                                      typography
  -----------------------------------------------------------------------

The repository also contains a `Footers` directory. Additional section
types and variants can be added to the component library and registered
with the website renderer.

### AI-assisted website generation

The backend contains a modular generation pipeline built around Groq and
structured generation modules:

1.  **Planning:** Generate a website plan from the user's description.
2.  **Section generation:** Generate content and configuration for
    individual sections.
3.  **Supporting services:** Resolve theme, typography, and
    image-related data.
4.  **Assembly:** Combine the generated plan and section data into a
    website structure.

Relevant implementation areas include:

-   `server/src/GenAI/planner/`
-   `server/src/GenAI/sections/`
-   `server/src/GenAI/services/`
-   `server/src/GenAI/generateWebsite.js`

The AI workflow is designed to produce structured website data that can
be consumed by the same rendering system used by manually created
websites.

## Technology Stack

  -----------------------------------------------------------------------
  Layer                               Technology
  ----------------------------------- -----------------------------------
  Frontend                            React, Vite

  Routing                             React Router

  State management                    Redux Toolkit

  API communication                   Axios

  Backend                             Node.js, Express

  Database                            MongoDB, Mongoose

  Authentication                      JWT and HTTP-only cookies

  AI integration                      Groq / LLM API

  Styling                             CSS and CSS custom properties

  Testing                             Jest/Vitest-style test files are
                                      present; check package scripts for
                                      the configured runner
  -----------------------------------------------------------------------

## Architecture

``` text
┌─────────────────────────────────────────────────────────────┐
│                         React Client                         │
│                                                             │
│  Landing Page   Authentication   Dashboard   Website Editor │
│                                           │                 │
│                                     Redux Toolkit           │
│                                           │                 │
│                               API modules (Axios)           │
│                                           │                 │
│                                  Website Renderer            │
│                              Section Registry + Variants    │
└───────────────────────────────────────────┬─────────────────┘
                                            │ REST API
                                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Express Server                         │
│                                                             │
│  Routes → Middleware → Controllers → Services / Utilities   │
│       │                                                     │
│       ├── Authentication and admin                          │
│       ├── Website and section management                    │
│       ├── Theme and typography                              │
│       └── Contact submissions                               │
│                                                             │
│                      GenAI Pipeline                         │
│             Planner → Section Generator → Assembler         │
└───────────────────────────┬─────────────────────┬───────────┘
                            │                     │
                            ▼                     ▼
                       MongoDB                Groq LLM API
```

### Website rendering flow

1.  The client retrieves the website configuration through the API.
2.  The renderer reads the website's theme and typography settings.
3.  Design values are applied through CSS custom properties.
4.  Disabled sections are excluded.
5.  Enabled sections are ordered using their configured `order`.
6.  The section registry maps each section type to its React component.
7.  The renderer supplies the section's content and selected variant.
8.  React renders the assembled website.

### Section configuration

The section model is designed around fields such as:

  Field           Purpose
  --------------- ------------------------------------------
  `sectionName`   Identifies the section type
  `variant`       Selects a visual layout
  `enabled`       Controls whether the section is rendered
  `order`         Controls the section's position
  `content`       Stores section-specific data

## Repository Structure

The following tree reflects the repository structure shared for this
README. Generated folders and dependencies such as `node_modules`, build
output, and logs are omitted.

``` text
.
├── README.md
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       │   ├── Dashboard/
│       │   ├── Elements/
│       │   │   ├── AboutSection/
│       │   │   ├── AccordianSection/
│       │   │   ├── ColumnSection/
│       │   │   ├── ContactSection/
│       │   │   ├── Footers/
│       │   │   ├── Headers/
│       │   │   └── HeroSection/
│       │   ├── LandingPageComponents/
│       │   └── UserWebPage/
│       ├── hooks/
│       ├── pages/
│       │   ├── Admin/
│       │   ├── Auth/
│       │   ├── Dashboard/
│       │   ├── EditWebsite/
│       │   ├── Home/
│       │   ├── LandingPage/
│       │   └── NotFound/
│       ├── redux/
│       │   └── slices/
│       ├── renderer/
│       ├── routes/
│       └── style/
│
└── server/
    ├── src/
    │   ├── GenAI/
    │   │   ├── planner/
    │   │   ├── sections/
    │   │   └── services/
    │   ├── config/
    │   ├── controllers/
    │   │   └── sections/
    │   ├── middleware/
    │   ├── models/
    │   │   └── sections/
    │   ├── routes/
    │   │   └── sections/
    │   ├── services/
    │   ├── utils/
    │   └── validators/
    ├── test/
    └── uploads/
```

### Frontend directory guide

  ------------------------------------------------------------------------
  Directory                            Responsibility
  ------------------------------------ -----------------------------------
  `client/src/api/`                    Axios instance and API modules for
                                       authentication, websites, themes,
                                       typography, sections, hero, and
                                       contact submissions

  `client/src/components/Elements/`    Reusable website section components
                                       and their visual variants

  `client/src/components/Dashboard/`   Dashboard creation and theme
                                       settings popups

  `client/src/pages/`                  Application pages, including
                                       authentication, dashboard, admin,
                                       and website editor

  `client/src/redux/slices/`           Redux state slices for auth,
                                       themes, editor, hero, projects,
                                       sections, and typography

  `client/src/renderer/`               Website renderer and section
                                       registry

  `client/src/routes/`                 Public, protected, and admin route
                                       handling

  `client/src/hooks/`                  Reusable React hooks

  `client/src/style/`                  Global styles and shared style
                                       definitions
  ------------------------------------------------------------------------

### Backend directory guide

  ------------------------------------------------------------------------
  Directory                            Responsibility
  ------------------------------------ -----------------------------------
  `server/src/GenAI/`                  LLM client, website generation,
                                       planner, section generation,
                                       schemas, and generation services

  `server/src/config/`                 Database and environment
                                       configuration

  `server/src/controllers/`            Request handling and application
                                       logic

  `server/src/controllers/sections/`   Section-specific controller logic

  `server/src/middleware/`             Authentication, admin access,
                                       bootstrap, and website ownership
                                       checks

  `server/src/models/`                 Mongoose models for users,
                                       websites, themes, typography,
                                       submissions, and sections

  `server/src/routes/`                 API route definitions

  `server/src/routes/sections/`        Section-specific API routes

  `server/src/utils/`                  Shared backend utilities

  `server/test/`                       Backend tests

  `server/uploads/`                    Upload storage directory
  ------------------------------------------------------------------------

## Getting Started

### Prerequisites

-   Node.js and npm
-   MongoDB instance (local or hosted)
-   Groq API key for AI generation features

### 1. Clone the repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
```

### 2. Install backend dependencies

``` bash
cd server
npm install
```

### 3. Install frontend dependencies

``` bash
cd ../client
npm install
```

### 4. Configure environment variables

Create the environment files expected by the application. The server has
environment configuration in `server/src/config/env.js`; check that file
and the package source for the exact variable names.

Typical values may include:

``` env
# Server
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

The frontend API base URL is configured through the Axios instance. Set
it using the variable name expected by
`client/src/api/axiosInstance.js`.

**Do not commit `.env` files, API keys, database credentials, or JWT
secrets.**

### 5. Run the application

Start the backend from the `server` directory:

``` bash
npm run dev
```

Start the frontend in a second terminal from the `client` directory:

``` bash
npm run dev
```

Check each directory's `package.json` for the exact available scripts
and ports. Open the local URL printed by the Vite development server.

## Security

-   Store secrets in environment variables.
-   Never expose the Groq API key or other private credentials in
    frontend code.
-   Use HTTP-only cookies for authentication tokens.
-   Validate incoming API data on the server.
-   Verify website ownership before modifying a website or its sections.
-   Configure CORS and cookie security settings appropriately for local
    development and production.

## Tests

Backend test files are located in:

``` text
server/test/
```

They currently cover areas including admin middleware, image services,
website planning, and section generation. Run the test command defined
in `server/package.json`.

## Roadmap

The following is a development checklist. Update it as work is
completed.

-   [ ] Complete and refine the manual website editing workflow.
-   [ ] Expand the reusable section and variant library.
-   [ ] Improve section settings and content editing.
-   [ ] Complete and refine AI website planning and generation.
-   [ ] Improve generated image and asset handling.
-   [ ] Add end-to-end tests for website creation and editing.
-   [ ] Finalize preview and publishing workflows.
-   [ ] Prepare production deployment and monitoring.

## Contributing

Contributions, suggestions, and bug reports are welcome.

1.  Fork the repository.
2.  Create a feature branch.
3.  Make and test your changes.
4.  Open a pull request with a clear description of the change.

## License

No license is currently specified. Add a `LICENSE` file and update this
section before distributing the project as open source.

------------------------------------------------------------------------

**Built with React, Node.js, MongoDB, and Groq.**
