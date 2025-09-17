import { NavLink } from "react-router-dom";
import { Home, BarChart, Wallet, X, LogOut,User,HammerIcon } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, path: "/" },
    { name: "Leaderboard", icon: <BarChart size={20} />, path: "/leaderboard" },
    { name: "Wallet", icon: <Wallet size={20} />, path: "/wallet" },
    {name: "kyc", icon:<User size={20} />, path: "/kyc" },
    {name:"Mining", icon:<HammerIcon size={20} />, path:"/mining" }

  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Toggle Button with animation */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 p-2 rounded-lg text-white hover:bg-gray-700 transition-all duration-200"
        onClick={() => setOpen(!open)}
      >
        <div className="relative w-6 h-6">
          <span className={`absolute block w-6 h-0.5 bg-white transform transition-all duration-300 ${open ? 'rotate-45 top-3' : 'top-1'}`}></span>
          <span className={`absolute block w-6 h-0.5 bg-white top-3 transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`absolute block w-6 h-0.5 bg-white transform transition-all duration-300 ${open ? '-rotate-45 top-3' : 'top-5'}`}></span>
        </div>
      </button>

      {/* Sidebar - Added fixed positioning and height calc */}
      <div
        className={`fixed top-0 left-0 h-screen w-[280px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 flex flex-col transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-all duration-300 ease-in-out z-40 shadow-xl overflow-hidden`}
      >
        {/* Logo Section */}
        <div className="relative z-20 bg-gray-900">
          <div className="text-2xl font-bold px-6 py-6 border-b border-gray-700/50 backdrop-blur-sm bg-gray-900/50">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Codexac
            </span>
          </div>
        </div>

        {/* Navigation Menu - Fixed height calculation */}
        <div className="flex-1 flex flex-col h-[calc(100vh-144px)]"> {/* 144px = logo height + logout height */}
          <div className="relative flex-1">
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none z-10" />
            <ul className="px-4 py-6 space-y-2 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white font-medium"
                          : "hover:bg-gray-800/50 text-gray-300"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <span className="relative z-10 transition-transform duration-200 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logout Button - Fixed at bottom */}
        <div className="relative z-20 p-4 bg-gray-900 border-t border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 group"
          >
            <LogOut size={20} className="transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
