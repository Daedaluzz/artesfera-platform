# Project Description: ArtEsfera

## 1. Overview

ArtEsfera is a comprehensive digital ecosystem designed to support and promote the arts in Brazil. It aims to be a central hub for artists, creators, cultural producers, and businesses, providing tools for professionalization, a marketplace for art and talent, and an innovative AI assistant to navigate the complexities of the cultural sector.

The platform is built with a modern tech stack, featuring a Next.js frontend, TypeScript, and a stylish, responsive UI using Tailwind CSS and shadcn/ui. A key design principle is "glassmorphism," which gives the interface a sleek, modern feel.

## 2. Core Features

### a. Cultural Marketplace

*   **Digital Gallery:** A space for artists to exhibit and sell their work.
*   **Talent Discovery:** A platform for contractors to find and hire artists for projects.
*   **Portfolio Hosting:** Artists can create and manage their professional portfolios.

### b. Daeva AI - The Cultural Assistant

A standout feature of ArtEsfera is **Daeva AI**, an intelligent assistant specializing in the Brazilian cultural market. Daeva is designed to provide expert guidance in several key areas:

*   **General:** General advice on the cultural market.
*   **Grants (`Editais`):** Assistance with finding and applying for cultural grants, including project and budget creation.
*   **Contracts (`Contratos`):** Help with drafting and understanding artistic contracts.
*   **Presentations (`Apresentações`):** Guidance on planning and structuring cultural events and presentations.
*   **Producer (`Produtora`):** Career development advice for artists.

The AI is implemented with a modular API structure, allowing for specialized responses based on the selected area of expertise.

### c. Professionalization and Promotion

*   **Educational Resources:** Tools and information to help artists professionalize their careers.
*   **Networking:** Connecting professionals within the cultural sector.
*   **Funding Opportunities:** Support for finding and securing funding for cultural projects.

## 3. Target Audience

ArtEsfera is designed for a wide range of users in the Brazilian cultural scene:

*   **Artists and Creators:** From painters and sculptors to musicians and writers.
*   **Cultural Producers and Curators:** Professionals who manage and organize cultural projects.
*   **Cultural Businesses:** Galleries, theaters, publishers, and record labels.
*   **Contractors:** Companies and individuals looking to hire artistic talent.

## 4. Technical Stack and Architecture

*   **Framework:** Next.js 15 (with App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4 with shadcn/ui for components.
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Theming:** `next-themes` for light and dark modes.

The application is structured with a clear separation of concerns, with pages, reusable components, and a dedicated `lib` folder for utilities. The main landing page is composed of several sections, each in its own component. The Daeva AI feature has its own page and a set of API routes for its different specializations.

## 5. Project Structure Highlights

```
/src
|-- /app
|   |-- / (Landing Page)
|   |-- /daeva (Daeva AI Assistant)
|   |-- /gallery
|   |-- /login
|   |-- /profile
|   |-- /api/daeva/... (API routes for the AI)
|-- /components
|   |-- /ui (shadcn/ui components)
|   |-- HeroSection.tsx
|   |-- AboutSection.tsx
|   |-- ... (other landing page sections)
|-- /lib
|   |-- utils.ts
|   |-- ...
```

## 6. Getting Started

To run the project locally, you need Node.js 18+.

1.  Clone the repository.
2.  Install dependencies with `npm install`.
3.  Run the development server with `npm run dev`.
4.  Build for production with `npm run build` and start with `npm run start`.

The application is optimized for deployment on Vercel.

## 7. Page Descriptions

### a. Main Page (`/`)

The main page serves as the landing page for the ArtEsfera platform. It is a long-scrolling page composed of several sections, each designed to introduce the user to the platform's features and benefits.

*   **`HeroSection.tsx`**: This is the first thing a user sees. It contains a compelling headline, a brief description of the platform's value proposition, and prominent call-to-action buttons for signing up with Google or email. It features a modern design with a large image in a "glassmorphic" container.

*   **`AboutSection.tsx`**: This section provides a more detailed explanation of what ArtEsfera is. It describes the platform as an ecosystem for the Brazilian art market and lists its key features, such as "Matchmaking Inteligente," "Daeva.AI," "Ticketeria Acessível," "Cursos & Certificações," and "Comunidade & Mentoria." It also includes some statistics to build trust.

*   **`FeaturesSection.tsx`**: This section highlights the core features of the platform in a card-based layout. Each card includes an icon, a title, and a short description. The features highlighted are: connecting with artists, finding exclusive projects, creating a professional portfolio, and the "Match Inteligente" system.

*   **`DaevaAISection.tsx`**: This section is dedicated to introducing the "Daeva.AI" assistant. It explains that the AI is specialized in the Brazilian cultural market and can help with tasks like understanding public grants, creating contracts, and preparing professional presentations.

*   **`HowItWorksSection.tsx`**: This section explains the user journey on the platform in four simple steps: creating a profile, exploring opportunities, connecting with others, and collaborating on projects. It uses a combination of text and a visual element to illustrate the process.

*   **`CommunityImpactSection.tsx`**: This section focuses on the social proof and the positive impact of the platform. It showcases statistics like the number of connected artists, successful matches, and completed projects. It also highlights the quality and vibrancy of the community.

*   **`TestimonialsSection.tsx`**: This section displays testimonials from satisfied users, including artists and marketing directors. Each testimonial includes the user's name, role, a quote, and a star rating, which helps to build credibility.

*   **`CTASection.tsx`**: This is the final call-to-action section at the bottom of the page. It encourages users to sign up with a clear headline and "Start for Free" and "Learn More" buttons. It also includes trust indicators like "100% Free Registration" and "No Hidden Fees."

### b. Daeva AI Page (`/daeva`)

This page provides the user interface for interacting with the "Daeva AI" assistant. It's a full-screen chat application with a sidebar for navigation and specialization selection.

*   **`daeva/page.tsx`**: This file serves as the entry point for the `/daeva` route. It's a simple component that uses React's `<Suspense>` to show a loading indicator while the main `Daeva.tsx` component is being loaded. This is a good practice for performance, as the main chat component might be large.

*   **`Daeva.tsx`**: This is the core component of the AI chat interface. It manages the state of the conversation, including the messages, the input value, and the loading status. It also handles the logic for sending messages to the correct API endpoint based on the selected AI specialization. The component uses `framer-motion` for animations, creating a smooth and engaging user experience. It also uses `react-markdown` to render the assistant's responses, allowing for formatted text, lists, and code blocks.

*   **`DaevaSidebar.tsx`**: This component is the navigation and control panel for the Daeva AI. It allows the user to:
    *   Start a new chat.
    *   View chat history (currently a placeholder).
    *   Switch between different AI specializations (General, Grants, Contracts, Presentations, Producer).
    *   Access settings (currently a placeholder).
    The sidebar is responsive, collapsing into a mobile menu on smaller screens. It features a "glassmorphic" design consistent with the rest of the application. On desktop, hovering over "Especializações" reveals a secondary panel with more details about each specialization.

### c. Gallery Page (`/gallery`)

This page serves as the main gallery or marketplace for the ArtEsfera platform, where users can discover artworks and artists.

*   **`gallery/page.tsx`**: Similar to the other pages, this file is a simple wrapper that imports and renders the main `Gallery.tsx` component.

*   **`Gallery.tsx`**: This is the main component for the gallery page. It is currently a placeholder, but it lays out the structure for a functional gallery. It consists of three main parts:
    *   **Header:** A title and a brief description of the gallery.
    *   **Filter Section:** A set of filter buttons for different art categories (e.g., "Artes Visuais," "Música," "Teatro"). This section is designed to allow users to narrow down the displayed artworks. The buttons have a "glassmorphic" design and interactive hover effects.
    *   **Gallery Grid:** A grid of placeholder artworks. Each artwork is displayed in a card with an image placeholder, a title, a description, artist information, and tags. The cards have a "glassmorphic" design and a hover effect that subtly lifts the card.
    *   **Load More Button:** A button at the bottom of the page to load more artworks.

The component is built with `framer-motion` to provide smooth animations for the header, filter section, and the grid items. The code is well-structured and ready to be connected to a real data source.

### d. Login Page (`/login`)

This page provides a standard login form for users to access their accounts.

*   **`login/page.tsx`**: This file is a simple wrapper that renders the `Login.tsx` component.

*   **`Login.tsx`**: This component displays a login form with the following features:
    *   **Header:** A welcoming message to the user.
    *   **Social Login:** A prominent button to log in with a Google account.
    *   **Email/Password Login:** A traditional login form with fields for email and password.
    *   **"Remember Me" and "Forgot Password":** Standard features for a better user experience.
    *   **Submit Button:** A primary button to submit the login form.
    *   **Link to Register:** A link to the registration page for new users.

The component has a clean and modern design, consistent with the rest of the platform, and uses "glassmorphic" effects for the form container. It also includes basic form validation with the `required` attribute on the input fields.

### e. Register Page (`/register`)

This page provides a standard registration form for new users to create an account.

*   **`register/page.tsx`**: This file is a simple wrapper that renders the `Register.tsx` component.

*   **`Register.tsx`**: This component displays a registration form with the following features:
    *   **Header:** A welcoming message encouraging users to join the platform.
    *   **Social Login:** A prominent button to sign up with a Google account.
    *   **Email/Password Registration:** A traditional registration form with fields for email and password.
    *   **Submit Button:** A primary button to submit the registration form.
    *   **Link to Login:** A link to the login page for existing users.

The component has a clean and modern design, consistent with the rest of the platform, and uses "glassmorphic" effects for the form container. It also includes basic form validation with the `required` attribute on the input fields and a hint for the password length.

### f. Profile Page (`/profile`)

This page allows users to view and manage their profile information. It is a placeholder page with a well-designed layout that includes a sidebar for navigation and a main content area for displaying and editing profile details.

*   **`profile/page.tsx`**: This file is a simple wrapper that renders the `Profile.tsx` component.

*   **`Profile.tsx`**: This component is the main view for the user's profile. It is divided into two main sections:
    *   **Sidebar:** A sidebar on the left displays the user's profile picture, name, and artistic category. It also contains a navigation menu with links to different profile sections, such as "Informações Pessoais," "Portfolio," "Preferências," etc.
    *   **Main Content:** The main content area on the right displays the user's information in a form. The form is pre-filled with placeholder data and includes fields for:
        *   Basic information (name, email, phone).
        *   Artistic information (type of artist, experience, biography, specialties).
    *   **Action Buttons:** The form has "Cancel" and "Save Changes" buttons.
    *   **Quick Stats:** Below the form, there are cards displaying quick stats about the user's activity on the platform (e.g., "Projetos," "Conexões," "Visualizações").

The component has a clean and modern design with a gradient background and "glassmorphic" effects on the containers. The code is well-structured and ready to be connected to a real data source.

### g. Projects Page (`/projects`)

This page is designed for users to discover and explore cultural projects. It's a placeholder page that lays out the structure for a project board.

*   **`projects/page.tsx`**: This file is a simple wrapper that renders the `Projects.tsx` component.

*   **`Projects.tsx`**: This component is the main view for the projects page. It consists of the following sections:
    *   **Header:** A title and a brief description of the projects page.
    *   **Search and Filters:** A search bar and a filter button to allow users to search for specific projects and apply filters.
    *   **Projects Grid:** A grid of placeholder project cards. Each card displays the project's category, title, a brief description, and key information like the deadline, location, and budget. Each card also has a "View Details" button.
    *   **Load More Button:** A button at the bottom of the page to load more projects.

The component uses `framer-motion` for animations and has a clean, modern design with "glassmorphic" effects, consistent with the rest of the platform. The code is well-structured and ready to be connected to a real data source.

## 8. Styling and Glassmorphism

The application uses a custom implementation of "glassmorphism" to create a modern and visually appealing user interface. The styles are defined in `src/app/globals.css` and are applied throughout the application using a combination of CSS custom properties and Tailwind CSS utility classes.

### a. Core Concepts

The glassmorphism effect is achieved through a combination of the following CSS properties:

*   **`backdrop-filter: blur(...)`**: This is the key property that creates the frosted glass effect by blurring the content behind the element. The application defines three levels of blur: `--blur-light` (12px), `--blur-medium` (16px), and `--blur-heavy` (24px).

*   **Translucent Backgrounds**: The backgrounds of the glassmorphic elements are semi-transparent, allowing the blurred background to be visible. The colors are defined as CSS custom properties, for example, `--glass-bg: rgba(255, 255, 255, 0.35)` for the light theme and `--glass-bg: rgba(255, 255, 255, 0.08)` for the dark theme.

*   **Borders**: A subtle, semi-transparent border is used to create a "glowing edge" effect, which helps to separate the glassmorphic element from the background. The border color is also defined as a custom property, for example, `--glass-border: rgba(255, 255, 255, 0.6)`.

*   **Shadows**: The application uses a combination of `box-shadow` and `inset` shadows to create a sense of depth and to lift the elements off the page. There are several custom shadow definitions, such as `.shadow-primary-glass` and `.shadow-secondary-glass`, which are applied to different components.

### b. Color Palette

The application defines a rich color palette in the `:root` and `.dark` selectors. The brand colors include:

*   `--color-brand-pink: #a4144e`
*   `--color-brand-orange: #f05913`
*   `--color-brand-navy-blue: #010166`
*   `--color-brand-blue: #21daed`
*   `--color-brand-red: #da0f17`
*   `--color-brand-yellow: #fcc931`
*   `--color-brand-green: #1f9c74`
*   `--color-brand-white: #fdf6ec`
*   `--color-brand-black: #292423`
*   `--color-brand-brown: #574c42`

These colors are used throughout the application to create a consistent and vibrant look and feel.

### c. Custom Utility Classes

The `globals.css` file also defines a set of custom utility classes under the `@layer utilities` directive. These classes, such as `.glass-card-light`, `.glass-button-light`, and `.shadow-primary-glass`, encapsulate the glassmorphism styles and make them easy to apply to different components in the application. This approach allows for a consistent and maintainable implementation of the glassmorphism effect.

## 9. Technical Summary for New Agents

This is a Next.js 15 application built with TypeScript and the App Router. The application is a platform for the Brazilian art scene called ArtEsfera, which aims to connect artists with opportunities.

### Core Technologies:

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **UI:** Tailwind CSS v4 with shadcn/ui
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Theming:** `next-themes` (light/dark mode)

### Architecture:

The application follows a standard Next.js App Router structure.

*   **Pages:** Pages are located in `src/app/[page_name]`. Each page has a `page.tsx` file that wraps the main component for that page. For example, `src/app/gallery/page.tsx` renders the `Gallery.tsx` component.
*   **Components:** Reusable components are located in `src/components`. This includes UI components (in `src/components/ui`) and section components used on the main page.
*   **API:** API routes are located in `src/app/api`. The main API feature is the `Daeva AI` assistant, which has several endpoints for different specializations (e.g., `/api/daeva/editais`, `/api/daeva/contratos`).
*   **Styling:** Global styles and CSS custom properties are defined in `src/app/globals.css`. The application uses a custom implementation of "glassmorphism" which is applied via utility classes.

### Key Features & Components:

*   **Main Page (`/`):** A landing page composed of several section components (`HeroSection`, `AboutSection`, etc.).
*   **Daeva AI (`/daeva`):** A chat interface for the AI assistant. The main logic is in `Daeva.tsx`, with navigation in `DaevaSidebar.tsx`.
*   **Gallery (`/gallery`):** A marketplace for artworks with filtering and a grid view. The main component is `Gallery.tsx`.
*   **Authentication (`/login`, `/register`):** Standard login and registration pages.
*   **User Profile (`/profile`):** A page for users to manage their profile information.
*   **Projects (`/projects`):** A page for discovering and exploring cultural projects.

### Getting Started:

1.  Run `npm install` to install dependencies.
2.  Run `npm run dev` to start the development server.
3.  The application will be available at `http://localhost:3000`.

This summary should provide a new agent with a good starting point for understanding the codebase.
