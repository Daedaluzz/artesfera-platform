This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Installed Libraries

This project utilizes the following key libraries:

- **Next.js**: A React framework for building full-stack web applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **shadcn/ui**: A collection of accessible and customizable UI components built with Radix UI and Tailwind CSS.
- **Framer Motion**: A production-ready motion library for React.
- **next-themes**: A library for managing themes (light/dark mode) in Next.js applications.
- **lucide-react**: A collection of beautiful and customizable SVG icons for React.

## Custom Styling Variables

Custom styling variables (design tokens) are defined in `src/app/globals.css` under the `:root` and `.dark` selectors. These variables are used to manage fonts, brand colors, shadows, and other design aspects, ensuring consistency across the application and supporting light/dark themes.

Example usage in Tailwind CSS classes:
`bg-[var(--glass-bg)]`
`text-[var(--primary-pink)]`

### Using custom variables and classes in Tailwind

All custom styling variables and modifications should be added directly to `src/app/globals.css`. This file is the single source of truth for all design tokens and custom utility classes. There is no need to create or modify `tailwind.config.ts` or any other separate styling files. Ensure new variables and classes follow the existing pattern within `globals.css`.

## Lucide React Icons

Lucide React icons can be imported and used in two main ways:

1.  **Direct Import (for specific icons):**
    Import individual icons by their name:
    ```typescript
    import { Home, MessageSquare } from 'lucide-react';

    function MyComponent() {
      return (
        <>
          <Home className="w-5 h-5" />
          <MessageSquare size={24} />
        </>
      );
    }
    ```

2.  **Importing all as a namespace (for dynamic usage):**
    Import all icons under a namespace for dynamic rendering, useful when icon names are stored as strings (e.g., in a configuration array):
    ```typescript
    import * as Icons from 'lucide-react';

    interface NavLink {
      title: string;
      path: string;
      icon: keyof typeof Icons; // Type for icon name
    }

    const navLinks: NavLink[] = [
      { title: 'Home', path: '/', icon: 'Home' },
      { title: 'Contact', path: '/contact', icon: 'MessageSquare' },
    ];

    function NavBar() {
      return (
        <nav>
          {navLinks.map((link) => {
            const LucideIcon = Icons[link.icon];
            return (
              <a key={link.title} href={link.path}>
                <LucideIcon className="w-5 h-5" /> {link.title}
              </a>
            );
          })}
        </nav>
      );
    }
    ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
