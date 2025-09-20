import { useState } from "react";
import Loader from "./Loader";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    referralCode: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://api.funchatparty.online/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess("Account created successfully! You can login now.");
      // navigate to login page after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      setFormData({
        username: "",
        email: "",
        password: "",
        referralCode: ""
      });
      
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Welcome Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-green-900 via-gray-900 to-gray-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{
          background: "radial-gradient(circle at 60% 40%, #22c55e 0%, transparent 70%)"
        }}></div>
        <div className="z-10 text-center px-10">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Join Codexac!</h1>
          <p className="text-lg mb-8 text-green-100">Create your account and start your journey with <span className="font-bold text-green-400">Codexac</span>.</p>
          <img src="https://svgshare.com/i/13wG.svg" alt="Signup Illustration" className="w-64 mx-auto drop-shadow-2xl" />
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex flex-1 justify-center items-center bg-gray-950">
        <form
          onSubmit={handleSignup}
          className="relative bg-gray-900 bg-opacity-90 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-green-900"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-green-700 to-green-400 rounded-full p-2 shadow-lg">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-center text-green-400 mt-8 tracking-wide">Sign Up</h2>

          <div className="mb-5">
            <label className="block text-green-200 mb-2 font-semibold" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Your username"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-green-700 focus:border-green-400 focus:ring-2 focus:ring-green-500 outline-none transition"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-green-200 mb-2 font-semibold" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-green-700 focus:border-green-400 focus:ring-2 focus:ring-green-500 outline-none transition"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-green-200 mb-2 font-semibold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-green-700 focus:border-green-400 focus:ring-2 focus:ring-green-500 outline-none transition"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <p className="text-xs text-green-200/60 mt-1">
              Must be at least 6 characters long
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-green-200 mb-2 font-semibold" htmlFor="referralCode">
              Referral Code <span className="text-green-200/60">(Optional)</span>
            </label>
            <input
              id="referralCode"
              name="referralCode"
              type="text"
              placeholder="Enter referral code"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-green-700 focus:border-green-400 focus:ring-2 focus:ring-green-500 outline-none transition"
              value={formData.referralCode}
              onChange={handleChange}
            />
            <p className="text-xs text-green-200/60 mt-1">
              Get 10 CXAC bonus when using a valid referral code
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/20 text-green-400 text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 py-3 rounded-lg font-bold text-lg text-white shadow-md transition-all duration-200"
          >
            Sign Up
          </button>

          <div className="mt-6 text-center text-green-200 text-sm">
            <span>Already have an account? </span>
            <a
              href="/login"
              className="text-green-400 hover:underline font-semibold"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
