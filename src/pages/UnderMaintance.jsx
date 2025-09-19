import { useEffect, useState } from 'react';
import { Cog, Wrench, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnderMaintenance = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // Simulated progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated Gears */}
        <div className="relative flex justify-center mb-8">
          <Cog 
            size={60} 
            className="text-blue-400 animate-spin-slow"
          />
          <Cog 
            size={40} 
            className="text-purple-400 animate-spin-reverse-slow absolute -right-4 top-0"
          />
          <Wrench 
            size={30} 
            className="text-green-400 absolute -left-2 bottom-0 animate-bounce"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Under Maintenance
          </h1>
          <p className="text-gray-400 mb-6">
            We're currently upgrading our systems to provide you with better service.
            Please check back soon!
          </p>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-700 rounded-full mb-4">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Estimated Time */}
          <p className="text-sm text-gray-500 mb-8">
            Estimated completion: A few hours
          </p>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Need immediate assistance?
          </p>
          <a 
            href="mailto:thecodexaofficalmail@gmail.com"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            thecodexaofficalmail@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default UnderMaintenance;