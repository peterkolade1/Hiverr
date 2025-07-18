# Hiverr - UGC Influencer Marketing Platform

## Overview

Hiverr is a full-stack web application that connects brands with content creators for User-Generated Content (UGC) campaigns. The platform features a modern React frontend with TypeScript, an Express.js backend, and PostgreSQL database with Drizzle ORM. The application showcases creators with "Hive Score" ratings, campaigns, and includes an inquiry system for connecting brands with creators across multiple niches including Beauty & Skincare, Fitness & Health, Food & Cooking, Fashion & Lifestyle, Technology, Photography, Music & Audio, and Travel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the client application
- **Vite** as the build tool and development server with hot module replacement
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** with a custom design system for styling
- **Shadcn/UI** component library for consistent UI components
- **Framer Motion** for smooth animations and micro-interactions
- **TanStack Query** for server state management and API data fetching
- Component-based architecture with modular UI components

### Backend Architecture
- **Express.js** with TypeScript for the REST API server
- **Drizzle ORM** for database operations and schema management
- **Neon Database** (PostgreSQL) as the primary database
- RESTful API design with proper error handling and logging
- Database storage implementation with PostgreSQL backend
- Waitlist functionality with database persistence

### Database Design
- PostgreSQL database with four main tables:
  - `creators` - Content creator profiles with skills, rates, and social metrics
  - `campaigns` - Brand campaign information with success metrics
  - `inquiries` - Communication requests between brands and creators
  - `waitlist` - Early access signups for AI features
- JSON fields for storing array data (platforms, metrics)
- Proper relationships and constraints with serial primary keys

## Recent Changes
- **July 2025**: Updated brand waitlist form with dropdown for creator types and removed brand logo upload field
- **July 2025**: Updated waitlist form to remove portfolio link and rate per post fields, changed avatar upload to social platform ownership verification
- **July 2025**: Removed all optional fields from creator schema (hourlyRate, profileImage, isAvailable, isVerified)
- **July 2025**: Removed Photography filter and creator from showcase per user request
- **July 2025**: Streamlined creator showcase to display exactly one influencer per category for cleaner filtering
- **July 2025**: Updated creator showcase with high-quality category-specific images for all niches
- **July 2025**: Added "Coming Soon" popup functionality for search button with branded styling and waitlist redirection
- **July 2025**: Made disclaimer text extremely subtle using light gray italic styling for demo profiles
- **July 2025**: Removed hourly rate displays from creator cards per user preference
- **December 2024**: Created dedicated waitlist page with separate comprehensive forms for brands and creators
- **December 2024**: Updated hero section to display only 4 core influence niches (Lifestyle & Fashion, Food & Lifestyle, Beauty & Skincare, Fitness & Wellness)
- **December 2024**: Moved "Hive Leaderboard" section to appear before "Ready to monetize your creativity" section on creators page
- **December 2024**: Replaced all waitlist modal functionality with navigation to dedicated `/waitlist` page

## Key Components

### Frontend Components
- **Landing Page** with hero section, creator showcase, services, and success stories
- **Creator Showcase** displaying creator profiles with Hive Scores and niche filtering system
- **Niche Filter System** allowing users to filter creators by 9 categories with interactive buttons
- **Services Section** highlighting platform-specific creator categories
- **Success Stories** featuring campaign metrics and testimonials
- **Inquiry System** for brands to contact creators
- **Dedicated Waitlist Page** with separate comprehensive forms for brands and creators
- **Custom Hiverr Logo** hexagonal design with purple-cyan gradient branding
- **Responsive Design** optimized for mobile and desktop with Eudoxus Sans typography

### Backend Components
- **Route Handlers** for creators, campaigns, and inquiries endpoints
- **Storage Layer** with interface-based design for easy database switching
- **Validation** using Zod schemas for request data validation
- **Error Handling** with consistent error responses and logging

### UI Component Library
- Complete Shadcn/UI implementation with 40+ components
- Custom theme with brand colors (orange, purple, cyan)
- Custom Hiverr logo components (HiverLogo, HiverWordmark) with SVG graphics
- Consistent design tokens and CSS variables
- Accessible components following WAI-ARIA guidelines

## Data Flow

1. **Client Requests** - React components use TanStack Query to fetch data
2. **API Layer** - Express routes handle HTTP requests and responses
3. **Validation** - Zod schemas validate incoming request data
4. **Storage** - Memory storage (development) or database operations
5. **Response** - JSON responses sent back to client
6. **State Management** - TanStack Query manages cache and updates

### Key API Endpoints
- `GET /api/creators` - Fetch all content creators
- `GET /api/campaigns` - Fetch all campaigns with success metrics
- `POST /api/inquiries` - Submit brand inquiry forms
- `POST /api/waitlist` - Join waitlist for AI features

## External Dependencies

### Core Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Styling**: Tailwind CSS, Class Variance Authority, Radix UI primitives
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Validation**: Zod for schema validation
- **Icons**: Lucide React, React Icons (Font Awesome)
- **Development**: TypeScript, Vite, ESBuild

### Development Tools
- **Hot Reload**: Vite development server with HMR
- **Code Quality**: TypeScript strict mode, ESNext modules
- **Build Process**: Vite for frontend, ESBuild for backend bundling

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations managed via `drizzle-kit push`

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Production/development environment detection
- Replit-specific development tools and banners

### Hosting Considerations
- Static frontend assets served from Express in production
- Single-port deployment with Express serving both API and static files
- PostgreSQL database hosted on Neon with connection pooling
- Environment-based configuration for database and build settings

The application follows modern full-stack development practices with clear separation of concerns, type safety throughout, and a scalable architecture that can easily transition from development to production environments.