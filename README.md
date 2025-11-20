# SoSLaw Frontend with Authentication

This is the frontend application for SoSLaw with integrated authentication system.

## Features

### Authentication System

- **User Registration**: Full name, phone number, email, and password
- **User Login**: Email and password authentication
- **Role-Based Access**: Admin and Client roles
- **Protected Routes**: Certain pages require authentication
- **Automatic Redirects**:
  - Admin users → Dashboard after login
  - Client users → Home page after login
  - Unauthenticated users → Auth page for protected routes

### Protected Routes

The following routes require authentication:

- `/join-team` - Join team page
- `/role/:roleId` - Role details
- `/services/:serviceId` - Service details
- `/library` - Legal library

### Admin-Only Routes

- `/dashboard/*` - Admin dashboard (admin role required)

## Technical Implementation

### Dependencies

- **React Query**: For API state management and caching
- **Axios**: HTTP client for API calls
- **js-cookie**: Cookie management for JWT tokens
- **React Router**: Navigation and route protection

### Key Components

#### AuthContext (`src/contexts/AuthContext.jsx`)

- Manages authentication state
- Handles login, register, and logout
- Provides user information and role checking
- Automatic token management with cookies

#### ProtectedRoute (`src/components/ProtectedRoute.jsx`)

- Route protection component
- Role-based access control
- Loading states during authentication checks
- Automatic redirects based on user role

#### API Service (`src/services/api.js`)

- Centralized API configuration
- Automatic token injection
- Error handling and token refresh
- Cookie-based authentication

#### Custom Hooks (`src/hooks/useAuthMutations.js`)

- React Query mutations for auth operations
- Automatic cache invalidation
- Error handling and loading states

### Authentication Flow

1. **Registration**:

   - User fills registration form
   - API call to `/auth/register`
   - JWT token stored in HTTP-only cookie
   - User redirected based on role

2. **Login**:

   - User provides email/password
   - API call to `/auth/login`
   - JWT token stored in HTTP-only cookie
   - User redirected based on role

3. **Route Protection**:

   - ProtectedRoute checks authentication status
   - Redirects to `/auth` if not authenticated
   - Checks role permissions if specified
   - Renders protected content if authorized

4. **Logout**:
   - API call to `/auth/logout`
   - Token removed from cookie
   - User redirected to home page
   - All cached data cleared

### Security Features

- **HTTP-only Cookies**: JWT tokens stored securely
- **Automatic Token Refresh**: Handled by backend
- **Role-Based Access Control**: Admin/Client permissions
- **Protected Routes**: Authentication required for sensitive pages
- **Automatic Redirects**: Based on user role and authentication status

## Usage

### Starting the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Make sure the backend server is running on `https://api-v1.soslawdz.com`

### Testing Authentication

1. **Register a new user**:

   - Navigate to `/auth`
   - Switch to registration mode
   - Fill in the form with valid data
   - Submit to create account

2. **Login with existing user**:

   - Navigate to `/auth`
   - Enter email and password
   - Submit to authenticate

3. **Test protected routes**:

   - Try accessing `/join-team` without authentication
   - Should redirect to `/auth`
   - After login, should redirect back to intended page

4. **Test role-based access**:
   - Login as admin user → redirected to `/dashboard`
   - Login as client user → redirected to home page
   - Try accessing admin routes as client → redirected appropriately

## Backend Integration

The frontend expects the backend to be running with the following endpoints:

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get current user profile
- `PUT /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/refresh` - Refresh JWT token

## Environment Variables

No additional environment variables are required for the frontend. The API base URL is configured to use `https://api-v1.soslawdz.com` for production.

## Notes

- The design and styling remain unchanged from the original implementation
- Only authentication logic has been added
- All existing functionality is preserved
- Mobile responsiveness is maintained
- Internationalization (i18n) support is preserved
