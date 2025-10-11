# KingdomPay - Digital Wallet Application

A modern, responsive digital wallet application built with React and Express.js, featuring beautiful UI design with glassmorphism effects and smooth animations.

## 🚀 Features

- **Modern UI Design**: Beautiful glassmorphism effects with gradient backgrounds
- **Responsive Design**: Optimized for mobile and desktop devices
- **Authentication**: Secure login system with demo credentials
- **Wallet Management**: Personal wallet with balance tracking
- **Transaction History**: View recent transactions with beautiful cards
- **Savings Goals**: Track savings goals with progress bars and animations
- **Community Wallets**: Manage church, family, and SACCO group wallets
- **Smooth Animations**: Professional-grade animations and micro-interactions
- **Social Login**: Google, Apple, and Mobile Money integration options

## 🎨 Design Features

- **Color Scheme**: Green and gold gradient theme
- **Typography**: Google Sans, Inter, and Manrope fonts
- **Icons**: Material Symbols with proper loading
- **Animations**: Fade-in, slide-in, ripple effects, and hover animations
- **Glassmorphism**: Backdrop blur effects on cards and navigation
- **Mobile-First**: Touch-friendly interactions and iOS optimizations

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API calls
- **Custom CSS** with inline styles for precise control
- **Material Icons** for consistent iconography

### Backend
- **Express.js** server
- **In-memory storage** for demo purposes
- **CORS** enabled for cross-origin requests
- **JWT** token-based authentication
- **bcryptjs** for password hashing

## 📱 Pages

1. **Login Page**: Clean authentication with social login options
2. **Home Dashboard**: Balance overview, quick actions, and transaction history
3. **Profile Page**: User settings, security options, and account management
4. **Savings Page**: Goals tracking with animated progress bars
5. **Community Page**: Group wallet management with announcements

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kingdompay-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   cd backend
   npm install
   node server.js
   ```

4. **Start the frontend development server**
   ```bash
   cd ..
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Demo Login
- **Email**: demo@kingdompay.com
- **Password**: password123

## 🎯 Usage

1. **Login**: Use demo credentials or social login options  demo@kingdompay.com / password123
2. **Dashboard**: View balance, perform quick actions (Add, Send, Swap, More)
3. **Transactions**: Browse recent transaction history
4. **Savings**: Set and track savings goals
5. **Community**: Manage group wallets and view announcements
6. **Profile**: Update settings, security, and preferences

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/seed` - Seed demo data

### User Data
- `GET /api/user` - Get user profile
- `GET /api/transactions` - Get transaction history
- `GET /api/savings/goals` - Get savings goals
- `GET /api/community/groups` - Get community groups

## 🎨 Customization

### Colors
The app uses CSS custom properties for easy theming:
```css
:root {
  --primary-dark-green: #1A3F22;
  --secondary-olive-green: #58761B;
  --gold-accent: #D99201;
  --bronze-support: #905A01;
}
```

### Animations
Custom keyframe animations are defined in each component:
- `fadeInUp` - Entrance animations
- `ripple` - Button press effects
- `shimmer` - Progress bar effects
- `pulse` - Attention-grabbing elements

## 📱 Mobile Optimization

- **Touch-friendly**: Optimized button sizes and spacing
- **iOS Support**: Prevents zoom on form inputs
- **Smooth Scrolling**: Native-like scroll behavior
- **Safe Areas**: Proper handling of device notches

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for password security
- **CORS Protection**: Configured for production use
- **Input Validation**: Form validation and error handling

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform

### Backend (Railway/Heroku)
1. Set environment variables for production
2. Deploy the backend folder to your platform
3. Update frontend API URLs for production

## 📄 License

This project is for demonstration purposes. Please ensure proper licensing for production use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For questions or support, please create an issue in the repository.

---

**KingdomPay** - Modern Digital Wallet Solution 🏦✨