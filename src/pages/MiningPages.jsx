import { useState, useEffect } from 'react';
import { Play, TrendingUp, Clock, Award, AlertCircle } from 'lucide-react';

const MiningPage = () => {
  const [miningStatus, setMiningStatus] = useState(false);
  const [miningStats, setMiningStats] = useState({
    hashRate: 0,
    totalMined: 0,
    uptime: 0,
  });
  const [error, setError] = useState(null);
  const [cooldownInfo, setCooldownInfo] = useState(null);
  const [userData, setUserData] = useState(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.user?.id || user?.id;
  const uid = user?.user?.uid || userData?.uid;

  // Fetch user data and check mining status
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://api.funchatparty.online/api/getUserByUid/${uid}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUserData(data.user);
          
          // Check if user is in cooldown period
          if (data.user.lastMiningTime) {
            const lastMining = new Date(data.user.lastMiningTime);
            const cooldownEnd = new Date(lastMining.getTime() + (24 * 60 * 60 * 1000));
            const now = new Date();
            
            if (now < cooldownEnd) {
              setCooldownInfo({
                message: "Mining cooldown period active",
                nextAvailable: cooldownEnd
              });
            }
          }

          // Update mining stats
          setMiningStats(prev => ({
            ...prev,
            totalMined: data.user.totalCoins || 0
          }));
        }
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    if (uid) {
      fetchUserData();
      // Refresh data every minute
      const interval = setInterval(fetchUserData, 60000);
      return () => clearInterval(interval);
    }
  }, [uid, user.token]);

  const startMining = async () => {
    if (!userId) {
      setError('User ID is required. Please login again.');
      return;
    }

    if (cooldownInfo?.nextAvailable && new Date() < new Date(cooldownInfo.nextAvailable)) {
      return;
    }

    try {
      setError(null);
      const response = await fetch('https://api.funchatparty.online/api/mining/coin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          userId,
          ipaddress: await fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => data.ip)
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          setCooldownInfo({
            message: data.message,
            nextAvailable: new Date(data.nextMiningAvailableAt)
          });
          setMiningStatus(false);
        } else {
          throw new Error(data.message || 'Failed to start mining');
        }
        return;
      }

      // Update stats after successful mining
      setMiningStatus(true);
      setMiningStats(prev => ({
        ...prev,
        totalMined: data.totalCoins || prev.totalMined + data.minedCoins,
      }));

      setCooldownInfo({
        message: `Successfully mined ${data.minedCoins} CXAC!`,
        nextAvailable: new Date(data.nextMiningAvailableAt)
      });

      // Refresh user data
      const updatedUserResponse = await fetch(`https://api.funchatparty.online/api/getUserByUid/${uid}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const updatedUserData = await updatedUserResponse.json();
      setUserData(updatedUserData.user);

    } catch (err) {
      setError(err.message);
      setMiningStatus(false);
    }
  };

  // Calculate remaining time
  const getRemainingTime = (nextAvailable) => {
    if (!nextAvailable) return null;
    
    const now = new Date();
    const next = new Date(nextAvailable);
    const diff = next - now;
    
    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Add cooldown timer effect
  useEffect(() => {
    let interval;
    if (cooldownInfo?.nextAvailable) {
      interval = setInterval(() => {
        const remaining = getRemainingTime(cooldownInfo.nextAvailable);
        if (!remaining) {
          setCooldownInfo(null);
          setMiningStatus(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownInfo]);

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getMiningStatus = () => {
    if (miningStatus) return { text: "Active", color: "text-green-400" };
    if (cooldownInfo) return { text: "Cooldown", color: "text-yellow-400" };
    return { text: "Ready to Mine", color: "text-blue-400" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Mining Control Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Mining Control Center</h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  miningStatus ? "bg-green-400" : 
                  cooldownInfo ? "bg-yellow-400" : "bg-blue-400"
                }`} />
                <p className="text-gray-400">
                  Status: <span className={getMiningStatus().color}>
                    {getMiningStatus().text}
                  </span>
                </p>
              </div>
              {cooldownInfo && (
                <p className="text-sm text-yellow-400 mt-2">
                  <AlertCircle className="inline-block mr-1" size={16} />
                  Next mining available in: {getRemainingTime(cooldownInfo.nextAvailable)}
                </p>
              )}
            </div>
            <button
              onClick={startMining}
              disabled={!!cooldownInfo}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                cooldownInfo 
                  ? "bg-gray-500 cursor-not-allowed opacity-50" 
                  : miningStatus
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
              }`}
            >
              <Play size={20} className={miningStatus ? "animate-pulse" : ""} />
              {miningStatus ? "Mining in Progress" : "Start Mining"}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Hash Rate */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-blue-400" />
              <h2 className="text-lg font-semibold">Mining Rate</h2>
            </div>
            <p className="text-3xl font-bold text-blue-400">
              2.00 CXAC/day
            </p>
          </div>

          {/* Total Balance */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-purple-400" />
              <h2 className="text-lg font-semibold">Total Balance</h2>
            </div>
            <p className="text-3xl font-bold text-purple-400">
              {userData?.totalCoins || 0} CXAC
            </p>
          </div>

          {/* Last Mining Time */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-green-400" />
              <h2 className="text-lg font-semibold">Last Mined</h2>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {userData?.lastMiningTime 
                ? new Date(userData.lastMiningTime).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
        </div>

        {/* Updated Mining Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Mining Information</h2>
          <ul className="space-y-2 text-gray-400">
            <li>• Fixed mining reward: 2 CXAC per mining session</li>
            <li>• Mining cooldown period: 24 hours</li>
            <li>• Mining is limited to one session per IP address</li>
            <li>• Ensure you're not using a VPN for mining</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg text-center mt-6">
            {error}
          </div>
        )}

        {/* Success Message */}
        {cooldownInfo?.message && !error && (
          <div className="bg-green-500/20 text-green-400 p-4 rounded-lg text-center mt-6">
            {cooldownInfo.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiningPage;