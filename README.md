# Codexac Mining App

A modern web application for crypto mining management with real-time tracking, wallet management, and mining controls.

## 🚀 Features

- **Real-time Dashboard**
  - Live mining statistics
  - Current hash rate monitoring
  - Mining rewards tracking

- **Secure Wallet Management**
  - QR code generation for addresses
  - QR code scanning for transfers
  - Transaction history
  - Real-time balance updates

- **User Authentication**
  - Secure login/signup
  - JWT token-based authentication
  - Protected routes

- **Mining Controls**
  - Start/Stop mining operations
  - Mining pool selection
  - Performance metrics

## 🛠️ Technology Stack

- **Frontend**
  - React.js
  - Tailwind CSS
  - HTML5-QRCode
  - Lucide Icons
  - React Router DOM

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Innocent-Developer/codexac-frontend
cd crypto-mining-app
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Environment Setup**
Create a `.env` file in the backend directory:
```env
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. **Start the application**
```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd frontend
npm start
```

## 🔧 Configuration

### Frontend Configuration
- Port: 3000 (default)
- API URL: http://localhost:4000 (configurable)

### Backend Configuration
- Port: 4000 (configurable)
- Database: MongoDB
- Authentication: JWT

## 📱 Screenshots

![Dashboard](./screenshots/dashboard.png)
![Wallet](./screenshots/wallet.png)
![Mining](./screenshots/mining.png)

## 🔒 Security Features

- JWT token authentication
- Protected API routes
- Secure wallet transactions
- Password hashing
- Rate limiting

## 🚦 API Routes

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/verify` - Token verification

### Wallet
- GET `/api/wallet/balance` - Get wallet balance
- POST `/api/wallet/transfer` - Transfer funds
- GET `/api/wallet/transactions` - Get transaction history

### Mining
- GET `/api/mining/stats` - Get mining statistics
- POST `/api/mining/start` - Start mining
- POST `/api/mining/stop` - Stop mining

## 💻 Development

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

### Running Tests
```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Issue #1: Description of known issue
- Issue #2: Description of known issue

## 🔮 Future Updates

- [ ] Mobile application
- [ ] Multiple wallet support
- [ ] Advanced mining analytics
- [ ] Automated trading features
- [ ] Mining pool integration

## 👥 Authors

- **Abubakkar Sajid** - *Software Developer* - [Innocent-Develope](https://github.com/Innocent-Developer)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc

## 📞 Support

For support, email abubakkarsajid4@gmail.com or join our Slack channel.

---

Made with ❤️ by [Abubakkar sajid](https://abubakkar.online)
