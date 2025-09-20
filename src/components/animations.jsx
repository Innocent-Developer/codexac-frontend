import {  Loader2, Coins } from 'lucide-react';
const MiningAnimation = () => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative">
      {/* Mining Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            <div className="w-1 h-1 bg-blue-400 rounded-full" />
          </div>
        ))}
      </div>
      
      {/* Central Mining Animation */}
      <div className="relative z-10 bg-gray-800/50 rounded-2xl p-8 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Coins className="w-16 h-16 text-yellow-400 animate-bounce" />
            <div className="absolute inset-0 animate-ping">
              <Coins className="w-16 h-16 text-yellow-400/30" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold text-white">Mining in Progress</h3>
            <p className="text-gray-400">Please keep this page open</p>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin text-blue-400" />
            <span className="text-blue-400">Mining CXAC...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default MiningAnimation;
