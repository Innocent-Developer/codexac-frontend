import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser).user;
    const uid = parsedUser?.uid;

    if (!uid) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `https://api.funchatparty.online/api/getUserByUid/${uid}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch user data");

        setUserData(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleCopyWallet = async () => {
    if (userData?.address) {
      try {
        await navigator.clipboard.writeText(userData.address);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1500);
      } catch (err) {
        setCopySuccess(false);
      }
    }
  };

  if (loading) return <Loader />;
  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <p className="text-xl text-white">No user data found. Please login again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header Section - Updated content and styling */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <div className="inline-block p-2 rounded-full bg-white/10 backdrop-blur-sm mb-4">
          <img
            src="https://svgshare.com/i/13wF.svg"
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Welcome back, {userData.username}!
        </h1>
        <p className="text-gray-400 text-lg">Explore Your Mining Universe</p>
      </div>

      {/* Main Content - Updated card titles and content */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card - Updated heading and icons */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-blue-400">💎</span> Wallet Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Account ID</span>
              <span className="font-mono">
                {String(userData.uid).slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Your Address</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">
                  {String(userData.address).slice(0, 12)}...
                </span>
                <button
                  onClick={handleCopyWallet}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  {copySuccess ? "✅" : "📋"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card - Updated metrics and labels */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-green-400">⚡</span> Mining Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
                {userData.totalCoins}
              </p>
              <p className="text-sm text-gray-400 mt-1">CXAC Balance</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                #{userData.ranks}
              </p>
              <p className="text-sm text-gray-400 mt-1">Global Rank</p>
            </div>
          </div>
        </div>

        {/* Verification Status - Updated styling */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-yellow-400">🛡️</span> Security Status
            </h2>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              userData.isVerification 
                ? "bg-green-400/20 text-green-400" 
                : "bg-red-400/20 text-red-400"
            }`}>
              {userData.isVerification ? "Verified Account ✓" : "Verification Required"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Updated styling and labels */}
      <div className="max-w-4xl mx-auto mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => alert("Mining Feature Coming Soon")}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
        >
          <span className="text-lg">⛏️ Start Mining</span>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
        >
          <span className="text-lg">🚪 Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
