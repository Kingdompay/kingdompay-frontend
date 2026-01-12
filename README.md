# KingdomPay Frontend `v1.0`

## Overview
**KingdomPay** is a modern, responsive fintech web application designed for seamless digital transactions. It features a premium, nature-inspired UI (Dark/Light mode), secure authentication, QR code payments, savings goals, and a comprehensive admin dashboard.

## Key Features

### 🚀 Core Banking
-   **Dashboard**: Glassmorphic balance cards, quick actions (Send, Request, Add Money), and transaction history.
-   **Payments**: Send money via email/phone, scan QR codes, or request funds.
-   **Savings Goals**: Create visual savings goals (e.g., "New Laptop") and track progress.
-   **Cards**: Manage virtual/physical cards, freeze/unfreeze, and view details.

### 📱 User Experience
-   **App-Like Feel**: Global, smooth page transitions using `framer-motion`.
-   **Theme Engine**: Built-in Dark Mode (OLED friendly) and a custom "Soft Olive" Light Mode (`#E5EBE3`).
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop with adaptive layouts.
-   **Personal QR**: Each user has a unique, generated QR code for receiving funds instantly.

### 🛡️ Security & Admin
-   **Auth**: JWT-based authentication with protected routes.
-   **Admin Dashboard**: Dedicated portal for managing users, verifying identities, and processing withdrawals.
-   **Identity Verification**: Upload and verify ID documents (UI flow).

## Tech Stack
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS + Custom CSS Variables
-   **Animations**: Framer Motion
-   **Icons**: Google Material Symbols
-   **Fonts**: Outfit (Display), Google Sans (Body)
-   **QR**: `html5-qrcode` (Scanning), `react-qr-code` (Generation)

## Getting Started

### Prerequisites
-   Node.js (v14+)
-   NPM

### Installation

1.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Backend Server**
    ```bash
    cd backend
    node server.js
    ```
    *Server runs on port 5000.*

3.  **Start the Frontend**
    ```bash
    # In the root directory
    npm run dev
    ```
    *App runs on `http://localhost:5173`.*

## Login Credentials (Demo)

| Role | Email | Password |
| :--- | :--- | :--- |
| **User** | `user@example.com` | `password123` |
| **Admin** | `admin@kingdompay.com` | `admin123` |

## Project Structure
-   `/src/components`: All UI components and pages.
-   `/src/contexts`: Global state (Auth, DarkMode, Currency).
-   `/backend`: Simple Node.js/Express server with JSON file storage (`data/`).

---
*Built with ❤️ for the KingdomPay community.*