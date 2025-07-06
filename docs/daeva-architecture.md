# Daeva AI Architecture Documentation

## Overview

Daeva is ArtEsfera's AI-powered cultural assistant designed to help users with various aspects of the Brazilian cultural market. The system has been refactored into a dynamic, single-page architecture that supports multiple specializations while maintaining a consistent user experience.

## Architecture Overview

### Core Components

1. **Dynamic Chat Interface** (`src/app/daeva/Daeva.tsx`)
2. **Glassmorphic Sidebar** (`src/components/DaevaSidebar.tsx`)
3. **API Route Handlers** (`src/app/api/daeva/*/route.ts`)
4. **Specialization System** (Configuration-driven)

### Design Principles

- **Single Responsibility**: Each component has a clear, focused purpose
- **Configuration-Driven**: Specializations are defined through config objects
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Glassmorphism UI**: Follows ArtEsfera's design standards with translucent elements
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML

## File Structure

```
src/
├── app/
│   ├── daeva/
│   │   ├── Daeva.tsx              # Main dynamic chat interface
│   │   └── page.tsx               # Next.js page wrapper
│   └── api/
│       └── daeva/
│           ├── general/route.ts    # General cultural assistant API
│           ├── editais/route.ts    # Public funding/grants API
│           ├── contratos/route.ts  # Contracts specialist API
│           └── apresentacoes/route.ts # Presentations specialist API
└── components/
    └── DaevaSidebar.tsx           # Navigation and specialization sidebar
```

## Specialization System

### Available Specializations

1. **General** (`general`)

   - Broad cultural market assistance
   - Default specialization
   - General guidance and information

2. **Editais** (`editais`)

   - Public funding and grants
   - Project proposal writing
   - Resource capture strategies

3. **Contratos** (`contratos`)

   - Artistic contracts
   - Legal documentation
   - Agreement templates

4. **Apresentações** (`apresentacoes`)
   - Cultural presentations
   - Event planning
   - Performance organization

### Configuration Structure

Each specialization is defined by a `SpecializationConfig` object:

```typescript
interface SpecializationConfig {
  title: string; // Display title
  subtitle: string; // Description text
  icon: React.ComponentType<any>; // Lucide icon component
  placeholder: string; // Input placeholder text
  suggestions: Array<{
    // Quick suggestion buttons
    icon: React.ComponentType<any>;
    text: string;
  }>;
  apiEndpoint: string; // API route path
  welcomeMessage: string; // Initial greeting message
}
```

## State Management

### Chat State

The main `Daeva.tsx` component manages:

- **Current Specialization**: Active specialization type
- **Messages**: Array of chat messages with metadata
- **Input State**: Current user input and loading states
- **Sidebar State**: Mobile sidebar visibility

### URL Integration

- Uses `useSearchParams` to read URL parameters
- Supports `?spec=specialization` parameter for direct navigation
- Maintains specialization state across page refreshes

### State Flow

1. Component initializes with URL parameters or defaults to "general"
2. Specialization change updates internal state and UI configuration
3. Messages are stored in component state (future: persist in localStorage/database)
4. API calls are made to specialization-specific endpoints

## Routing System

### Page Routes

- **Primary Route**: `/daeva` - Main chat interface
- **URL Parameters**: `/daeva?spec=editais` - Direct specialization access

### API Routes

All API routes follow the pattern `/api/daeva/{specialization}`:

- `POST /api/daeva/general`
- `POST /api/daeva/editais`
- `POST /api/daeva/contratos`
- `POST /api/daeva/apresentacoes`

### Request/Response Format

**Request Body:**

```typescript
{
  message: string;
  specialization: SpecializationType;
}
```

**Response Body:**

```typescript
{
  content: string;
}
```

## UI/UX Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│ NavBar (4rem height)                    │
├─────────────┬───────────────────────────┤
│ Sidebar     │ Chat Area                 │
│ (fixed)     │ (scrollable)              │
│             │                           │
│ - New Chat  │ ┌─────────────────────┐   │
│ - History   │ │ Messages            │   │
│ - Specs     │ │ (scrollable)        │   │
│ - Settings  │ └─────────────────────┘   │
│             │ ┌─────────────────────┐   │
│             │ │ Input Area (fixed)  │   │
│             │ └─────────────────────┘   │
└─────────────┴───────────────────────────┘
```

### Responsive Behavior

- **Desktop (lg+)**: Sidebar visible as side panel
- **Mobile (<lg)**: Sidebar as slide-out drawer with backdrop
- **Chat area**: Always takes remaining width/height
- **Input area**: Fixed at bottom of chat area

### Glassmorphism Elements

- Sidebar: `bg-background/80 backdrop-blur-md`
- Chat bubbles: Semi-transparent with blur effects
- Input area: Subtle transparency with backdrop blur
- Mobile sidebar: Full backdrop blur overlay

## Animation System

### Framer Motion Animations

1. **Page Transitions**: Smooth fade-in on mount
2. **Message Animations**: Slide-up animation for new messages
3. **Sidebar Transitions**: Smooth slide animations for mobile
4. **Button Interactions**: Hover and tap animations
5. **Specialization Changes**: Fade transitions for content updates

### Animation Configuration

```typescript
// Page entrance
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// Message animation
const messageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};
```

## API Integration

### Current Implementation

- **Mock Responses**: All endpoints currently return mock data
- **Error Handling**: Basic try-catch with console logging
- **Response Format**: Consistent JSON structure across all endpoints

### Future LLM Integration

The API routes are prepared for LLM integration with commented examples:

```typescript
// TODO: Replace with actual LLM API call
const response = await fetch("YOUR_LLM_API_ENDPOINT", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LLM_API_KEY}`,
  },
  body: JSON.stringify({
    model: "your-model",
    messages: [
      {
        role: "system",
        content: "Specialization-specific system prompt",
      },
      {
        role: "user",
        content: message,
      },
    ],
    max_tokens: 1000,
    temperature: 0.7,
  }),
});
```

### Environment Variables

Required for production LLM integration:

```env
LLM_API_KEY=your_api_key_here
LLM_API_ENDPOINT=https://api.your-provider.com/v1/chat/completions
LLM_MODEL=your-model-name
```

## Accessibility Features

### Keyboard Navigation

- Tab order: Sidebar → Chat messages → Input field → Send button
- Enter key: Sends message
- Escape key: Closes mobile sidebar
- Arrow keys: Navigate suggestions

### Screen Reader Support

- ARIA labels on all interactive elements
- Semantic HTML structure (`main`, `aside`, `section`)
- Alt text for icons and images
- Live regions for dynamic content updates

### Visual Accessibility

- High contrast mode compatibility
- Focus indicators on all interactive elements
- Scalable text (respects user font size preferences)
- Color-blind friendly design (no color-only information)

## Performance Considerations

### Optimization Strategies

1. **Component Memoization**: React.memo for expensive components
2. **Lazy Loading**: Dynamic imports for heavy components
3. **Virtualization**: For long message lists (future implementation)
4. **Image Optimization**: Next.js Image component for avatars/icons
5. **Bundle Splitting**: Automatic code splitting via Next.js

### Memory Management

- Message history cleanup for long conversations
- Proper cleanup of event listeners and timers
- Efficient re-renders with React.useMemo and useCallback

## Security Considerations

### Input Sanitization

- User input validation before API calls
- XSS prevention through proper escaping
- Content Security Policy headers

### API Security

- Rate limiting on API endpoints
- Input validation on server side
- Secure environment variable handling
- CORS configuration for production

## Testing Strategy

### Unit Tests

```typescript
// Example test structure
describe("Daeva Component", () => {
  test("renders with default specialization", () => {});
  test("switches specialization correctly", () => {});
  test("sends messages to correct API endpoint", () => {});
  test("handles API errors gracefully", () => {});
});
```

### Integration Tests

- API route testing with mock LLM responses
- End-to-end user flow testing
- Accessibility testing with automated tools

## Future Enhancements

### Short Term

1. **LLM Integration**: Replace mock responses with actual AI
2. **Message Persistence**: Save chat history
3. **User Authentication**: Personal chat histories
4. **File Uploads**: Document analysis capabilities

### Medium Term

1. **Voice Interface**: Speech-to-text and text-to-speech
2. **Advanced Formatting**: Markdown support in responses
3. **Template System**: Pre-built project templates
4. **Collaboration Features**: Shared workspaces

### Long Term

1. **Multi-modal AI**: Image and document understanding
2. **Workflow Integration**: Direct integration with project management tools
3. **Analytics Dashboard**: Usage insights and performance metrics
4. **Plugin System**: Third-party integrations

## Development Guidelines

### Code Standards

- Follow ArtEsfera coding standards (TypeScript, ESLint, Prettier)
- Use Tailwind CSS for styling
- Implement proper error boundaries
- Write comprehensive JSDoc comments

### Component Structure

```typescript
// Component template
interface ComponentProps {
  // Props interface
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
};

export default Component;
```

### Adding New Specializations

1. Add to `SpecializationType` union type
2. Create configuration in `specializationConfigs`
3. Add API route in `/api/daeva/{specialization}/route.ts`
4. Update sidebar navigation in `DaevaSidebar.tsx`
5. Add appropriate tests

## Deployment Considerations

### Environment Setup

- Node.js 18+ required
- Next.js 14+ for app router support
- Environment variables for LLM API configuration

### Build Process

```bash
npm run build    # Production build
npm run start    # Start production server
npm run dev      # Development server
```

### Monitoring

- API response times and error rates
- User engagement metrics
- Chat completion rates
- Performance metrics (Core Web Vitals)

## Conclusion

The Daeva AI system is designed to be scalable, maintainable, and user-friendly. The configuration-driven approach allows for easy addition of new specializations, while the component-based architecture ensures code reusability and maintainability. The system is ready for LLM integration and can be extended with additional features as needed.

For questions or contributions, please refer to the main project documentation or contact the development team.
