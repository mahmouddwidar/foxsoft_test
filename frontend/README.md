# Frontend - React + TypeScript

This is the frontend application for the Laravel + React full-stack test.

## Features

- **Multi-Auth System**: Separate login pages for Admin and User
- **Role-based Access**: Different dashboards and permissions for each role
- **Posts Management**: Create, edit, delete posts with role-based permissions
- **Modern UI**: Clean, responsive design with custom CSS utilities
- **Protected Routes**: Authentication and authorization handling

## Tech Stack

- React 19.1.0
- TypeScript
- React Router DOM
- Axios for API communication
- Custom CSS utilities (Tailwind-like)

## Getting Started

### Prerequisites

- Node.js v22.18.0 or higher
- Backend Laravel server running on `http://localhost:8000`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Application Structure

```
src/
├── components/          # Reusable components
│   ├── LoginForm.tsx   # Login form component
│   ├── PostForm.tsx    # Post creation/edit form
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── UserLogin.tsx   # User login page
│   ├── AdminLogin.tsx  # Admin login page
│   ├── UserDashboard.tsx # User dashboard
│   ├── AdminDashboard.tsx # Admin dashboard
│   ├── CreatePost.tsx  # Create post page
│   └── EditPost.tsx    # Edit post page
├── services/           # API services
│   └── api.ts         # API configuration and methods
└── App.tsx            # Main application component
```

## Routes

- `/users/login` - User login page
- `/admins/login` - Admin login page
- `/users` - User dashboard (protected)
- `/admins` - Admin dashboard (protected)
- `/posts/new` - Create new post (protected)
- `/posts/:id/edit` - Edit post (protected)

## Authentication

The application uses Laravel Sanctum for authentication. After successful login:

1. API token is stored in localStorage
2. User data and type are stored in localStorage
3. Protected routes check authentication status
4. Role-based access control is enforced

## API Integration

The frontend communicates with the Laravel backend through:

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: Bearer token in Authorization header
- **Error Handling**: Automatic logout on 401 responses

## Features

### User Role

- Can create, edit, and delete their own posts
- Can view only their own posts
- Access to user dashboard

### Admin Role

- Can create, edit, and delete any post
- Can view all posts from all users
- Access to admin dashboard with enhanced permissions

## Development

### Adding New Features

1. Create components in `src/components/`
2. Create pages in `src/pages/`
3. Add API methods in `src/services/api.ts`
4. Update routes in `src/App.tsx`

### Styling

The application uses custom CSS utilities similar to Tailwind CSS. All utility classes are defined in `src/index.css`.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Laravel backend has proper CORS configuration
2. **Authentication Issues**: Check if backend is running and API endpoints are correct
3. **Routing Issues**: Verify all routes are properly defined in App.tsx

### Backend Requirements

Make sure your Laravel backend has:

- CORS middleware configured
- Sanctum authentication set up
- API routes properly defined
- Database migrations and seeders run
