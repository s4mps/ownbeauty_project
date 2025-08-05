**OwnBeauty - Full Stack Setup Guide**

This is a complete beauty e-commerce website built with React (frontend) and Node.js/Express (backend) with MySQL database.
Prerequisites

    Node.js (v16 or higher)
    MySQL Server (v8.0 or higher)
    npm or yarn

Quick Setup
1. Clone and Install Dependencies

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

2. Database Setup

Make sure MySQL is running, then:

# From the server directory
npm run db:setup

This will:

    Create the ownbeauty_db database
    Set up all required tables
    Insert sample products and a demo user

3. Environment Configuration

The .env file is located in the root directory and contains all necessary configuration:

    Database: ownbeauty_db
    User: root
    Password: sampana2006_
    Backend Port: 5000
    Frontend Port: 3000

Note: There is only one .env file in the root directory. The server is configured to read from this location.
4. Start the Application

Terminal 1 - Backend:

cd server
npm run dev

Terminal 2 - Frontend:

cd client
npm run dev

5. Access the Application

    Frontend: http://localhost:3000
    Backend API: http://localhost:5000/api

Demo Login(for some reason might not work)

Email: demo@example.com
Password: password123
Features Implemented
Frontend (React)

    ✅ Modern responsive design
    ✅ User authentication (login/register)
    ✅ Shopping cart functionality
    ✅ Product browsing
    ✅ Real-time cart updates
    ✅ Protected routes

Backend (Node.js/Express)

    ✅ RESTful API
    ✅ JWT authentication
    ✅ MySQL database integration
    ✅ Cart management
    ✅ Product management
    ✅ User management
    ✅ CORS configuration
    ✅ Input validation
    ✅ Error handling

Database (MySQL)

    ✅ Users table
    ✅ Products table
    ✅ Cart table
    ✅ Orders table
    ✅ Reviews table
    ✅ Sample data included

API Endpoints
Authentication

    POST /api/auth/login - User login
    POST /api/auth/register - User registration
    GET /api/auth/profile - Get user profile
    GET /api/auth/verify - Verify JWT token

Products

    GET /api/product - Get all products
    GET /api/product/:id - Get product by ID
    GET /api/product/featured - Get featured products
    GET /api/product/categories - Get product categories

Cart

    GET /api/cart - Get user's cart
    POST /api/cart/add - Add item to cart
    PUT /api/cart/item/:id - Update cart item quantity
    DELETE /api/cart/item/:id - Remove item from cart
    DELETE /api/cart/clear - Clear entire cart

Testing the Application

    Register a new account or use the demo login
    Browse products on the home page
    Add products to cart using the "Add to Cart" buttons
    View cart by clicking the cart icon in the navbar
    Modify quantities or remove items in the cart
    Proceed to checkout (simulated)

Database Schema

The application uses the following main tables:

    users: User authentication and profile data
    products: Product catalog with pricing and inventory
    cart: Shopping cart items linked to users
    orders: Order history and status
    reviews: Product reviews and ratings

Technology Stack

Frontend:

    React 18
    React Router DOM
    Framer Motion (animations)
    CSS Modules
    React Icons

Backend:

    Node.js
    Express.js
    MySQL2
    JWT (JSON Web Tokens)
    bcryptjs (password hashing)
    CORS
    Express Rate Limit

Database:

    MySQL 8.0

Troubleshooting
Database Connection Issues

    Ensure MySQL is running
    Check database credentials in .env
    Verify database exists: SHOW DATABASES;

Port Conflicts

    Frontend default: 3000
    Backend default: 5000
    Change ports in package.json if needed

CORS Issues

    Backend is configured for frontend on localhost:5173
    Update CORS settings in server/server.js if needed

Security Features

    Password hashing with bcryptjs
    JWT token authentication
    Input validation and sanitization
    Rate limiting for API endpoints
    CORS protection
    Helmet.js security headers

Development

The application is fully functional with:

    Real database integration
    Live API endpoints
    Complete user authentication
    Working shopping cart
    Product management
    Responsive design

Both frontend and backend are connected and working together to provide a complete e-commerce experience.
