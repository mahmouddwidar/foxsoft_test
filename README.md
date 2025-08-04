# FoxSoft Test Project

A full-stack web application built with Laravel and React, featuring user authentication, post management, and role-based access control.

## Demo Video

[FoxSoft Test Project Demo](https://github.com/user-attachments/assets/07bb5c46-d793-4a74-ab42-428aba0b6059)

## Features

- **Authentication System**

  - User login with role-based access
  - Token-based authentication using Laravel Sanctum
  - Protected routes based on user roles

- **Post Management**

  - Create, read, update, and delete posts
  - Post status management (draft/published)
  - Advanced search functionality
  - Pagination with configurable page size
  - Role-based permissions and policies

- **Admin Capabilities**
  - Assign posts to specific users
  - View and manage all posts in the system
  - User management capabilities


## Tech Stack

### Backend

- Laravel 12.0
- PHP 8.2+
- MySQL
- Laravel Sanctum for authentication

### Frontend

- React 19.1
- TypeScript
- Tailwind CSS
- Formik & Yup for form handling
- React Router v7
- Vite as build tool

## API Documentation

The complete API documentation is available here:
[Postman Collection](https://documenter.getpostman.com/view/33626443/2sB3BBpBK5)

## Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js & npm
- MySQL

### Backend Setup

1. Navigate to the backend directory:

```bash
cd ./backend
```

2. Install PHP dependencies:

```bash
composer install
```

> **Note**: If you encounter ZIP-related issues during installation, make sure to uncomment the ZIP extension in your php.ini file.

3. Set up environment:

```bash
cp .env.example .env
php artisan key:generate
```

4. Configure your database in `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=foxsoft_test
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Run migrations and seed the database:

```bash
php artisan migrate
php artisan db:seed
```

6. Start the development server:

```bash
php artisan serve
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit: `http://localhost:5173`


### Running Tests

To run the backend tests:

```bash
cd backend
php artisan test
```

## Project Structure

### Backend

- `app/Http/Controllers` - API controllers
- `app/Models` - Eloquent models
- `app/Http/Requests` - Form request validation
- `app/Http/Resources` - API resources
- `database/migrations` - Database migrations
- `routes/api.php` - API routes

### Frontend

- `src/components` - React components
- `src/contexts` - React contexts (auth, etc.)
- `src/services` - API services
- `src/utils` - Utility functions and validation schemas
- `src/pages` - Page components

## Improvements

### Backend Refactoring

1. **User Role Management**
   - Replace separate Admin model with role column in User model
   - Implement enum for user roles (USER, ADMIN)
   - Simplify authorization using single user table
   - Update policies to check user role instead of instance type

2. **API Enhancements**
   - Add endpoint to fetch all users for admin operations
   - Improve error responses with consistent format

3. **Database Optimization**
   - Implement soft deletes for posts

### Frontend Enhancements

1. **User Assignment**
   - Replace manual user ID input with user selection dropdown
   - Add user search/filter in selection
   - Show user details in selection (name, email)
   - Add user assignment validation
