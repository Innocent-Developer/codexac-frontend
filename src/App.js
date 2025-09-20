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
import LeaderBoard from "./pages/LeaderBoard.jsx";
import Explorer from "./pages/explorer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          {/* Main content */}
          <div className="flex-1 ml-0 md:ml-[280px] bg-gray-950 text-white min-h-screen p-4 md:p-6">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/leaderboard" element={<LeaderBoard />} />

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
                path="/wallet"
                element={
                  <ProtectedRoute>
                    <WalletPage />
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
                    <KycPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/explorer/tx/:hash" element={<Explorer />} />
              <Route path="/explorer/block/:number" element={<Explorer />} />
              <Route path="/explorer/address/:address" element={<Explorer />} />
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
