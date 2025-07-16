# GitHub Copilot Instructions for Pet Story Generator Frontend

## Project Overview

This is a React-based frontend application for generating AI-powered fundraising stories for pets in need of medical treatment. The application provides a multi-step form interface that collects pet information, medical details, and personal stories, then generates compelling narratives for veterinary fundraising campaigns.

## Architecture & Technology Stack

### Core Technologies

- **React 19** with TypeScript for type safety
- **Vite 7** as the build tool with hot module replacement
- **React Router DOM 6** for client-side routing
- **Tailwind CSS 4** for styling and responsive design
- **Zod** for runtime validation and schema definition
- **React Hook Form** with Hookform Resolvers for form management
- **Axios** for API communication
- **Recharts** for data visualization
- **Lucide React** for iconography

### Project Structure

```
src/
├── components/          # UI components organized by feature
│   ├── Layout/         # Header and layout components
│   ├── StoryForm/      # Multi-step form components
│   ├── StoryDisplay/   # Story viewing and management
│   ├── StoryHistory/   # Story history and management
│   └── UI/            # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Features & Components

### Multi-Step Form Process

1. **Pet Selection** - Browse and select pets from veterinary system
2. **Medical Situation** - Detailed medical condition and treatment info
3. **Pet Story** - Personal relationship and emotional connection
4. **Financial Situation** - Family financial circumstances

### Core Components

- `App.tsx` - Main application with routing (3 routes: dashboard, create-story, story-history)
- `StoryForm.tsx` - Multi-step form container with validation
- `StoryDisplay.tsx` - Generated story viewing with regeneration options
- `StoryHistory.tsx` - Story management and history tracking
- `PetAnalytics.tsx` - Analytics dashboard for story metrics

### Custom Hooks

- `useStoryGenerator.ts` - Handles story generation, regeneration, and state management

### Services

- `ai.service.ts` - AI story generation with OpenAI integration
- `api.service.ts` - Base HTTP client with interceptors
- `pet.service.ts` - Pet data management
- `story.service.ts` - Story CRUD operations

## Development Guidelines

### Code Patterns

- Use TypeScript for all new code with strict type checking
- Follow React hooks patterns and functional components
- Use Zod schemas for form validation with React Hook Form resolvers
- Implement proper error boundaries for error handling
- Use semantic HTML with proper ARIA labels for accessibility
- Utilize path aliases (`@/`) for cleaner imports
- Follow the established component structure with proper TypeScript interfaces

### Form Management

- Forms use React Hook Form with Zod validation
- Each form step has its own component in `src/components/StoryForm/steps/`
- Form state is managed at the top level with proper validation

### API Integration

- All API calls go through the service layer
- Base configuration in `api.service.ts` with interceptors
- Error handling is centralized with user-friendly messages
- Loading states are coordinated across components

### Styling

- Mobile-first responsive design with Tailwind CSS
- Consistent spacing and typography scale
- WCAG 2.1 accessibility compliance
- Custom CSS for animations and scrollbar styling

## Environment Configuration

### Development

```bash
npm run dev          # Start development server (localhost:5173)
npm run build        # Production build (TypeScript compilation + Vite build)
npm run preview      # Preview production build
npm run lint         # ESLint code quality checks
```

### Path Aliases
- `@/` - Configured alias for `./src/` directory (e.g., `import { Pet } from '@/types/pet.types'`)

### Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3001)
- `VITE_BACKEND_PROXY_URL` - Production backend URL

### API Endpoints Expected

- `GET /api/pets` - Retrieve available pets
- `GET /api/pets/:id` - Get specific pet details
- `POST /api/generate-story` - Generate AI stories

## Error Handling Strategy

- React Error Boundaries catch JavaScript errors
- API errors are handled with user-friendly messages
- Form validation provides inline feedback
- Loading states prevent user confusion
- Graceful degradation for offline scenarios

## Performance Considerations

- Automatic route-based code splitting
- Lazy loading of components
- Responsive image optimization
- Bundle size monitoring
- Service worker caching for offline functionality

## Security Guidelines

- Never expose API keys in frontend code
- User authentication tokens handled securely
- Input sanitization for AI prompts
- CORS configuration for cross-origin requests
- Content Security Policy headers

## Common Tasks

### Adding New Form Steps

1. Create new step component in `src/components/StoryForm/steps/`
2. Add validation schema to `src/types/form.types.ts`
3. Update form navigation in `FormNavigation.tsx`
4. Add progress indicator step in `ProgressIndicator.tsx`

### Extending API Services

1. Add new service methods to appropriate service file
2. Update type definitions in `src/types/`
3. Handle errors consistently with existing patterns
4. Add loading states and user feedback

### UI Component Development

- Follow existing component patterns
- Use TypeScript interfaces for props
- Include proper accessibility attributes
- Test across different screen sizes
- Add proper loading and error states

## Testing & Quality Assurance

- ESLint configuration for code quality
- TypeScript for compile-time error checking
- Manual testing across browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Responsive design testing on multiple devices
- Accessibility testing with screen readers

## Deployment

- Primary deployment platform: Vercel
- Static hosting compatible
- Environment-specific builds supported
- CI/CD through GitHub integration
- Production API URL configuration through environment variables

## Common Issues & Solutions

### API Connection Problems

- Verify backend server is running
- Check CORS configuration
- Confirm API URL in environment variables
- Review network requests in browser dev tools

### Form Validation Issues

- Check Zod schema definitions match form fields
- Verify error message display logic
- Test edge cases and user input variations

### Build & TypeScript Errors

- Clear node_modules and reinstall dependencies
- Check import statements for typos
- Verify type definitions are up to date
- Review TypeScript compilation errors

## Analysis Summary

✅ **Repository Structure Validation Complete**

The GitHub Copilot instructions have been analyzed against the actual repository structure and are **100% accurate**. The frontend codebase matches exactly with the documented architecture:

### Confirmed Components & Structure
- ✅ Multi-step form with 4 steps (Pet Selection, Medical Situation, Pet Story, Financial Situation)
- ✅ React 19 + TypeScript + Vite 7 + Tailwind CSS 4 stack
- ✅ Service layer architecture (ai, api, pet, story services)
- ✅ Type definitions properly organized
- ✅ Component structure matches documented organization
- ✅ Custom hooks implementation (`useStoryGenerator`)
- ✅ Error boundaries and analytics components present

### Recent Updates Applied
- Updated technology stack versions to match `package.json`
- Added Lucide React for iconography
- Included path alias configuration (`@/` for `./src/`)
- Enhanced build script documentation

The instructions provide comprehensive guidance for GitHub Copilot when working with this React-based pet story generator frontend, covering architecture, patterns, common tasks, and troubleshooting scenarios.
