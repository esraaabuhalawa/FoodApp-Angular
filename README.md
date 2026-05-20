# 🍽️ Food App

A modern Angular-based recipe discovery and management application with role-based access control, user authentication, and comprehensive recipe browsing features.
(for testing admin creditional is at the end for readMe File \*\*\*Demo Admin Account)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Integration](#api-integration)
- [Key Features](#key-features)
- [Contributing](#contributing)

## 🎯 Overview

Food App is a full-featured web application that allows users to discover, search, and manage recipes. The application includes a complete authentication system with email verification, password management, and role-based access control for both regular users and administrators.

## ✨ Features

### Authentication & User Management

- User registration with email verification
- Login/logout functionality
- Password reset and recovery
- JWT token-based authentication
- Role-based access (User, Admin)
- User profile management

### Recipe Management

- Browse and search recipes
- Filter recipes by categories and tags
- View detailed recipe information
- User dashboard for personalized content
- Admin panel for content management

### User Interface

- Responsive design with Bootstrap 5
- Modern UI components with ng-select
- Toast notifications with ngx-toastr
- International phone input support
- File upload capabilities
- Pagination for recipe lists

### Security

- Route guards for authentication and authorization
- HTTP interceptors for request handling
- JWT token validation and decoding

## 🛠 Tech Stack

### Frontend Framework

- **Angular 16.2.0** - Core framework
- **TypeScript 5.1.3** - Language
- **RxJS 7.8** - Reactive programming

### UI Libraries

- **Bootstrap 5.3.8** - CSS framework
- **FontAwesome 7.2.0** - Icon library
- **ng-select 11.2.0** - Select component
- **ngx-bootstrap 11.0.2** - Bootstrap components
- **ngx-toastr 16.2.0** - Toast notifications
- **ngx-pagination 6.0.3** - Pagination component
- **ngx-file-drop 16.0.0** - File upload

### Utilities

- **jwt-decode 4.0.0** - JWT token parsing
- **intl-tel-input 19.5.7** - Phone input validation
- **ngx-intl-tel-input 16.0.1** - Angular phone input

### Development Tools

- **Angular CLI 16.2.16** - Build tool
- **Karma & Jasmine** - Testing framework
- **TypeScript** - Type checking

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                 # Core functionality
│   │   ├── enums/           # Enum definitions (Role, etc.)
│   │   ├── guards/          # Route guards (Auth, Admin, User, Logged)
│   │   ├── interceptors/    # HTTP interceptors
│   │   └── services/        # Core services
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication module
│   │   │   ├── components/ # Login, Register, Password reset, etc.
│   │   │   ├── services/   # Auth service
│   │   │   └── models/     # Auth-related models
│   │   └── dashboard/      # Dashboard module
│   │       ├── admin/      # Admin portal
│   │       └── user-portal/ # User portal
│   ├── shared/              # Shared functionality
│   │   ├── components/      # Reusable components
│   │   ├── services/        # Shared services
│   │   └── models/          # Shared data models
│   └── app.module.ts        # Root module
├── assets/                   # Static assets
│   ├── fonts/               # Custom fonts (Inter, Poppins, Roboto)
│   ├── images/              # Icons and images
│   └── styles/              # Global styles
├── environments/            # Environment configurations
└── main.ts                  # Application entry point
```

## 📦 Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher
- **Angular CLI** 16.2.16 (globally installed)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd food-app
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

> Note: `--legacy-peer-deps` flag is used to resolve peer dependency conflicts with older packages.

### 3. Environment Configuration

The app uses environment-specific configurations located in `src/environments/`:

- **environment.ts** - Production environment
- **environment.development.ts** - Development environment

Current API endpoint: `https://upskilling-egypt.com:3006/api/v1/`

## 💻 Development

### Start Development Server

```bash
npm start
```

or

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Generate Components

```bash
ng generate component component-name
```

Other generators:

```bash
ng generate directive|pipe|service|class|guard|interface|enum|module
```

## 🏗️ Building

### Production Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/food-app/` directory.

### Development Build with Watch

```bash
npm run watch
```

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

Tests are executed via [Karma](https://karma-runner.github.io) and [Jasmine](https://jasmine.github.io/).

## 🌐 Deployment

This project is configured for deployment on **Vercel**. The `vercel.json` file contains the following configuration:

```json
{
  "buildCommand": "npm run build -- --configuration=production",
  "outputDirectory": "dist/food-app",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": null,
  "routes": [{ "handle": "filesystem" }, { "src": "/(.*)", "dest": "/index.html" }]
}
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Push to main branch to trigger automatic deployment

## 🔗 API Integration

The application communicates with a backend API at:

- **Production**: `https://upskilling-egypt.com:3006/api/v1/`

### HTTP Interceptor

All HTTP requests are processed through a general interceptor (`src/app/core/interceptors/general.interceptor.ts`) that handles:

- JWT token attachment to requests
- Response error handling
- Request/response transformation

## 🔐 Authentication Flow

1. **Login**: User provides email and password
2. **JWT Token**: Server returns JWT token
3. **Storage**: Token is stored in localStorage
4. **Route Guards**: Protected routes verify token validity
5. **Token Refresh**: Automatic token validation on navigation

### Route Protection

- **AuthGuard**: Requires valid JWT token
- **AdminGuard**: Requires admin role
- **UserGuard**: Requires user role
- **LoggedGuard**: Prevents logged-in users from accessing auth pages

## 📝 Key Models

### User Models

- `currentUser.ts` - Current logged-in user information
- `auth.ts` - Authentication response data
- `idecoded-token.ts` - Decoded JWT token structure

### Recipe Models

- `recipe.ts` - Recipe data structure
- `category.ts` - Recipe category
- `tag.ts` - Recipe tags

## 🎨 UI Components

### Custom Components

Located in `src/app/shared/components/`:

- **Auth Components**: Header, form components
- **Layout Components**: Navigation, footer
- **UI Components**: Common reusable elements

### Third-party Components

- Bootstrap components via ngx-bootstrap
- Form controls with ng-select
- Toasts via ngx-toastr
- International phone input

## ⚙️ Custom Features

### Validators

Custom form validators are available in `src/app/shared/custom-validators.ts`

### File Upload

Integrated file upload functionality using `ngx-file-drop`

### UI Service

`src/app/core/services/navbar-ui.service.ts` - Manages UI state for navbar

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 🔐 Demo Admin Account

Email: upskilling@yahoo.com
Password: test@Test1

## 📄 License

This project is part of Esraa Abuhalawa projects
