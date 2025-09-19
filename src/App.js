import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/sidebar";
import Login from "./components/login.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/Home.jsx";
import Signup from "./components/signup.jsx";
import WalletPage from "./pages/Wallet.jsx";
import MiningPage from "./pages/MiningPages.jsx";
import KycPage from "./pages/KycPage.jsx";
import UnderMaintenance from "./pages/UnderMaintance.jsx";

// Example Pages
const Home = () => <h1 className="text-2xl">Home Page</h1>;
const Leaderboard = () => <h1 className="text-2xl">Leaderboard</h1>;
const Wallet = () => <WalletPage />;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          {/* Main content - Added margin-left for sidebar width */}
          <div className="flex-1 ml-0 md:ml-[280px] bg-gray-950 text-white min-h-screen p-4 md:p-6">
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet"
                element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mining"
                element={
                  <ProtectedRoute>
                    <MiningPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kyc"
                element={
                  <ProtectedRoute>
                    <UnderMaintenance />
                  </ProtectedRoute>
                }
              />
              {/* Fallback Route */}
              <Route path="*" element={<h1 className="text-2xl">404 Not Found</h1>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
