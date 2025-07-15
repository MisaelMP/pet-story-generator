# Pet Story Generator Frontend

A React-based web application that enables users to create compelling fundraising stories for pets in need of medical treatment. The application provides a multi-step form interface for gathering pet information, medical details, and personal stories, then generates AI-powered narratives to support veterinary fundraising campaigns.

## Overview

This frontend application serves as the user interface for the Pet Story Generator system. It guides users through a structured process to collect comprehensive information about pets requiring medical treatment, then leverages AI to create engaging stories that can be used for fundraising purposes.

## Features

- **Multi-Step Form Interface**: Guided process for collecting pet and medical information
- **Pet Selection**: Browse and select from available pets in the veterinary system
- **Medical Information Capture**: Detailed forms for medical conditions, treatments, and costs
- **Personal Story Collection**: Capture the emotional connection between pets and their families
- **Financial Situation Assessment**: Gather information about the family's financial circumstances
- **AI Story Generation**: Generate compelling stories using collected information
- **Story Management**: View, edit, and manage generated stories
- **Analytics Dashboard**: Track story generation metrics and success rates
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Error Handling**: Comprehensive error boundaries and user feedback

## Technology Stack

- **React 19**: Modern React with latest features and concurrent rendering
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Fast build tool with hot module replacement
- **React Hook Form**: Performant form management with validation
- **Zod**: Runtime type validation and schema definition
- **React Router**: Client-side routing with nested routes
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Modern icon library
- **Recharts**: Data visualization for analytics
- **Axios**: HTTP client for API communication

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ErrorBoundary.tsx    # Error boundary for error handling
│   ├── PetAnalytics.tsx     # Analytics dashboard component
│   ├── Layout/              # Layout components
│   │   └── Header.tsx       # Application header
│   ├── StoryDisplay/        # Story viewing and management
│   │   └── StoryDisplay.tsx # Main story display component
│   ├── StoryForm/           # Multi-step form components
│   │   ├── StoryForm.tsx    # Main form container
│   │   ├── FormNavigation.tsx    # Form navigation controls
│   │   ├── ProgressIndicator.tsx # Form progress display
│   │   └── steps/           # Individual form steps
│   │       ├── PetSelectionStep.tsx
│   │       ├── MedicalSituationStep.tsx
│   │       ├── PetStoryStep.tsx
│   │       └── FinancialSituationStep.tsx
│   └── UI/                  # Common UI components
│       └── LoadingSpinner.tsx   # Loading indicator
├── hooks/                # Custom React hooks
│   └── useStoryGenerator.ts     # Story generation logic
├── services/             # API service layer
│   ├── api.service.ts       # Base API configuration
│   ├── ai.service.ts        # AI story generation service
│   ├── pet.service.ts       # Pet data service
│   └── story.service.ts     # Story management service
├── types/                # TypeScript type definitions
│   ├── form.types.ts        # Form-related types and schemas
│   ├── pet.types.ts         # Pet data types
│   └── story.types.ts       # Story-related types
├── utils/                # Utility functions
│   ├── analytics.ts         # Analytics helpers
│   ├── constants.ts         # Application constants
│   ├── formatting.ts        # Data formatting utilities
│   └── formValidation.ts    # Form validation helpers
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── vite-env.d.ts         # Vite environment types
```

## Prerequisites

- Node.js 18.0 or higher
- npm 7.0 or higher
- Access to Pet Story Generator Backend API
- Modern web browser with JavaScript enabled

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pet-story-generator-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**
   ```bash
   # Create .env file if custom API URL is needed
   echo "VITE_API_BASE_URL=http://localhost:3001" > .env
   ```

## Development

### Start Development Server

Run the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at:
- Local: `http://localhost:5173`
- Network: `http://[your-ip]:5173` (accessible from other devices)

### Build for Production

Create a production build:

```bash
npm run build
```

Built files will be generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Code Quality

Run ESLint for code quality checks:

```bash
npm run lint
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | http://localhost:3001 | No |

### API Configuration

The application expects the backend API to be available with the following endpoints:

- `GET /api/pets` - Retrieve available pets
- `GET /api/pets/:id` - Get specific pet details  
- `POST /api/generate-story` - Generate AI stories

## Features Overview

### Multi-Step Form Process

1. **Pet Selection Step**
   - Browse available pets from the veterinary system
   - View pet details including photos, breed, age, and medical status
   - Select the pet requiring assistance

2. **Medical Situation Step**
   - Enter detailed medical condition information
   - Specify treatment requirements and timeline
   - Provide cost estimates and urgency level

3. **Pet Story Step**
   - Capture the personal relationship with the pet
   - Describe the pet's personality and special qualities
   - Share memorable moments and the pet's impact on the family

4. **Financial Situation Step**
   - Assess the family's financial circumstances
   - Understand the impact of medical costs
   - Gather context for fundraising needs

### Story Generation

- **AI Integration**: Leverages OpenAI's GPT models for story creation
- **Personalization**: Incorporates all collected information for unique stories
- **Multiple Formats**: Generates stories optimized for different platforms
- **Content Moderation**: Ensures appropriate content for fundraising purposes

### Analytics Dashboard

- **Generation Metrics**: Track story creation rates and success
- **Performance Analytics**: Monitor form completion and user engagement
- **Story Effectiveness**: Analyze story performance and fundraising outcomes

## API Integration

### Service Architecture

The application uses a layered service architecture:

1. **API Service**: Base HTTP client configuration with interceptors
2. **Specialized Services**: Domain-specific services for pets, stories, and AI
3. **Error Handling**: Centralized error processing and user feedback
4. **Loading States**: Coordinated loading indicators across components

### Data Flow

```
User Input → Form Validation → API Service → Backend → AI Processing → Response → UI Update
```

## Form Validation

The application uses Zod schemas for comprehensive form validation:

```typescript
// Example validation schema
const medicalSituationSchema = z.object({
  condition: z.string().min(10, 'Detailed condition required'),
  timeline: z.string().min(5, 'Timeline information required'),
  treatment: z.string().min(10, 'Treatment details required'),
  cost: z.number().min(1).max(100000),
  urgency: z.enum(['immediate', 'urgent', 'planned'])
});
```

## Responsive Design

The application is built with mobile-first responsive design:

- **Mobile**: Optimized for phones and small tablets
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full-featured interface for large screens
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels

## Error Handling

### Error Boundaries

React Error Boundaries catch and handle JavaScript errors:

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### API Error Handling

Standardized error responses with user-friendly messages:

- Network errors
- Validation errors  
- Server errors
- Authentication issues

### User Feedback

- Toast notifications for success/error states
- Inline form validation messages
- Loading indicators for async operations
- Graceful degradation for offline scenarios

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Monitor bundle size and dependencies
- **Caching**: Service worker caching for offline functionality

## Deployment

### Static Hosting

The application can be deployed to any static hosting service:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` directory** to your hosting provider

### Popular Hosting Options

- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload to S3 bucket with static website hosting

### Environment-Specific Builds

Configure different API URLs for different environments:

```bash
# Development
VITE_API_BASE_URL=http://localhost:3001 npm run build

# Production  
VITE_API_BASE_URL=https://api.petstories.com npm run build
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify backend server is running
   - Check CORS configuration
   - Confirm API URL in environment variables

2. **Form Validation Issues**
   - Check Zod schema definitions
   - Verify form field names match schema
   - Review validation error messages

3. **Build Failures**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript compilation errors
   - Verify all imports are correct

4. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS rules
   - Verify responsive breakpoints

### Development Tools

- **React Developer Tools**: Browser extension for React debugging
- **Redux DevTools**: State management debugging (if using Redux)
- **Network Tab**: Monitor API requests and responses
- **Console**: Check for JavaScript errors and warnings

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Follow the existing code style and patterns
4. Add tests for new functionality
5. Ensure all forms and components are accessible
6. Test across different screen sizes and browsers
7. Commit changes: `git commit -am 'Add new feature'`
8. Push to branch: `git push origin feature/new-feature`
9. Submit a pull request with detailed description

### Code Style Guidelines

- Use TypeScript for all new code
- Follow React hooks patterns
- Implement proper error boundaries
- Use semantic HTML elements
- Ensure accessibility compliance
- Write descriptive component and function names
- Add JSDoc comments for complex functions

## License

This project is licensed under the MIT License. See the package.json file for details.
