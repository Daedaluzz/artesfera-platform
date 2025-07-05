---
applyTo: "**"
---

Coding standards, domain knowledge, and preferences that AI should follow.

# Coding Standards

- Use Tailwind CSS for styling.
- Use TypeScript for type safety.
- Use React for building user interfaces.
- Use functional components and hooks.
- Use ES6+ syntax (e.g., arrow functions, destructuring).
- Use `className` for CSS classes in JSX.
- Use `import` statements for module imports.
- Use `export` statements for module exports.
- Use `async/await` for asynchronous operations.
- Use `console.log` for debugging.
- Use `console.error` for error logging.
- Use shadcn UI components for UI elements.
- Use Lucide icons for icons.
- Use `className` for styling in shadcn UI components.
- Use `className` for styling in Lucide icons.
- Use `className` for styling in custom components.
- Use clean and readable code with proper indentation.
- Use comments to explain complex logic.
- Use consistent naming conventions (e.g., camelCase for variables and functions, PascalCase for
  components).
- Use TypeScript interfaces for component props.
- Use TypeScript enums for fixed sets of values.
- Use TypeScript types for function return values.
- Use Mobile-first design principles.
- Use responsive design techniques (e.g., media queries, responsive utilities).
- Use accessibility best practices (e.g., ARIA attributes, semantic HTML).
- Use performance optimization techniques (e.g., lazy loading, code splitting).
- Use error boundaries for error handling in React components.
- Use state management libraries (e.g., Redux, Zustand) for complex state management.
- Use Glassmorphic design principles for UI elements.
- Use Tailwind CSS utilities for Glassmorphic effects (e.g., `backdrop-blur`, `bg-gradient-to-br`).
- Use Tailwind CSS utilities for responsive design (e.g., `sm:`, `md:`, `lg:`, `xl:`).
- Use Tailwind CSS utilities for hover and focus states (e.g., `hover:`, `focus:`).
- Use motion librariy for animations and transitions (e.g., `framer-motion`).
- Use spring physics for smooth animations.
- Use `useEffect` for side effects in functional components.
- Use `useState` for managing component state.
- Use `useRef` for accessing DOM elements.
- Use `useContext` for accessing context values.
- Use `brand-yellow`for text and UI accents on light-theme.
- Use `brand-navy-blue` for text and UI accents on dark-theme.
- Primary CTA button text should be `brand-black` in dark mode for better readability against glassmorphic backgrounds and should not change color on hover.
- Secondary CTA button text should be `brand-white` in dark mode.
- Use standardized shadcn PrimaryButton and SecondaryButton components for all buttons and CTAs across the platform, with all styling and animation logic contained within the components.
- PrimaryButton and SecondaryButton components should receive all needed parameters (text, icons, onClick handlers, etc.) via props for maximum reusability.
- All button styling should follow the established glassmorphism and brand design patterns from CTASection.tsx.
- Never use solid color backgrounds on buttons or clickable elements.
- All clickable elements must follow glassmorphism principles with blur, transparency, and shining edges.
- Use colors only for hovers, accents, glows, and drop shadows.
- Primary CTAs must have shiny gradient white borders to distinguish from secondary CTAs.
- Secondary CTAs use standard glassmorphic borders without gradient enhancement.
- Button backgrounds should always be transparent with backdrop-blur effects.
- Use color gradients only in borders, glows, and hover states, never as solid backgrounds.
- All buttons and clickable elements MUST use the same reflexive hover animation as NavBar links, including: sliding white gradient reflection (before:left-[-100%] hover:before:left-full), color transitions (hover:text-brand-navy-blue dark:hover:text-brand-yellow), backdrop blur enhancement (hover:backdrop-blur-xl hover:bg-white/20), and subtle upward translation (hover:translate-y-[-1px]).
- Small text links (like terms of use, privacy policy, register links) should use simple hover color transitions without the full reflexive animation effects.
- All colors must be used in gradients, glows, and shadows, never as solid backgrounds.
- All colors used must be brand colors, never custom colors.
- All the brand colors custom tailwind classes can be found in the `global.css` file, under the comentary
  `/* ArtEsfera Brand Colors */`.
