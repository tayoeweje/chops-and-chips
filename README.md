# Chops & Chips

A modern restaurant ordering app built with Next.js 14 and Firebase.

## Features

- **Customer App**: Browse menu, add to cart, checkout, and track orders in real-time.
- **Admin Dashboard**: Manage menu items, customize theme, and update order statuses.
- **Real-time Updates**: Order status updates are reflected instantly using Firebase Firestore.

## Tech Stack

- Next.js 14
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- TypeScript

## Setup Instructions

1.  **Clone the repository** (if applicable).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Firebase**:
    -   Create a project in [Firebase Console](https://console.firebase.google.com/).
    -   Enable **Authentication** (Email/Password).
    -   Enable **Firestore Database**.
    -   Enable **Storage**.
    -   Copy your Firebase configuration keys.
    -   Create a `.env.local` file based on `.env.example` and paste your keys.
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
5.  **Open the app**:
    -   Customer App: `http://localhost:3000`
    -   Admin Dashboard: `http://localhost:3000/admin`

## Admin Setup

To access the admin dashboard, you need to create an admin user in Firebase Authentication manually or implement a signup flow (currently restricted to login only for security).

## Deployment

This app is ready for deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository.
2.  Import the project in Vercel.
3.  Add your environment variables in Vercel project settings.
4.  Deploy!
