# MERN Authentication System

This is a full-stack authentication system built with the MERN stack (MongoDB, Express, React, Node.js). The project demonstrates basic user authentication, including features like user registration, login, and password reset using email verification and OTP.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)

## Introduction

This project is an authentication system built using the **MERN stack**. It allows users to register, log in, and reset their password through an email-based verification process. The backend is built with Express.js and MongoDB, while the frontend is built using React.js. This project demonstrates how to implement user authentication in a real-world application.

## Features

- **User Registration**: Users can sign up with an email and password.
- **Login**: Registered users can log in to access protected resources.
- **Password Reset**: Users can reset their password by entering their email and verifying OTP sent to their email address.
- **User Authentication**: Ensures that users are authenticated before accessing protected routes.
- **Responsive UI**: Built with React to create an interactive and user-friendly interface.

## Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (local or remote instance)

### Steps to Set Up Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mern-authentication-system-using-react.git
   ```

2. Install the dependencies for both the client and server.

   - Navigate to the root directory of the project:
     ```bash
     cd mern-authentication-system-using-react
     ```

   - Install server dependencies:
     ```bash
     cd server
     npm install
     ```

   - Install client dependencies:
     ```bash
     cd ../client
     npm install
     ```

3. Set up environment variables:

   - In the `server` folder, create a `.env` file and add the necessary environment variables (e.g., MongoDB URI, JWT Secret, etc.).
   - Example `.env` file:
     ```
     MONGO_URI=mongodb://localhost:27017/mern_auth_db
     JWT_SECRET=your_jwt_secret
     ```

4. Run the development servers:

   - From the root folder, run:
     ```bash
     npm run dev
     ```
     This will start both the client and server simultaneously using `concurrently`.

   - Alternatively, you can run the client and server separately:
     - For the server:
       ```bash
       cd server
       npm run server
       ```
     - For the client:
       ```bash
       cd client
       npm run dev
       ```

## Running the Application

1. Once both the client and server are running, open your browser and navigate to `http://localhost:4000` to see the application in action.
2. You can now register a new user, log in, and test the password reset feature by entering your email.

## Deployment

This application can be deployed to services like **Vercel** for the frontend 


## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) and email-based OTP for password reset
- **Deployment**: Vercel (Frontend)
- **Other**: Axios, React Router, Toastify for notifications

## Folder Structure

```
mern-authentication-system-using-react/
│
├── client/                # Frontend React application
│   ├── public/            # Static assets for React app
│   └── src/               # React components, hooks, and services
│
├── server/                # Backend Express server
│   ├── controllers/       # API route handlers
│   ├── models/            # Mongoose models (User, OTP, etc.)
│   ├── routes/            # Express route definitions
│   ├── .env               # Environment variables for backend
│   ├── server.js          # Main server file
│
├── package.json           # Main project dependencies and scripts
├── README.md              # This file
└── .gitignore             # Git ignore settings
```

