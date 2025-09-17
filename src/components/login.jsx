import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already logged in (user data in localStorage)
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userObj = JSON.parse(user);
        // Check for a valid token and user object (basic check)
        if (
          userObj &&
          userObj.token &&
          userObj.user &&
          userObj.user.email &&
          userObj.user.id
        ) {
          navigate("/", { replace: true });
        }
      } catch (e) {
        // If parsing fails, remove invalid user data
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(data));

      // Navigate to /home after successful login
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Welcome Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-900 via-gray-900 to-gray-950 text-white relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, #2563eb 0%, transparent 70%)",
          }}
        ></div>
        <div className="z-10 text-center px-10">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            Welcome Back!
          </h1>
          <p className="text-lg mb-8 text-blue-100">
            Sign in to access your dashboard and continue your journey with{" "}
            <span className="font-bold text-blue-400">Codexac</span>.
          </p>
          <img
            src="https://svgshare.com/i/13wF.svg"
            alt="Login Illustration"
            className="w-64 mx-auto drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 justify-center items-center bg-gray-950">
        <form
          onSubmit={handleSubmit}
          className="relative bg-gray-900 bg-opacity-90 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-900"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-blue-700 to-blue-400 rounded-full p-2 shadow-lg">
            <svg
              className="w-14 h-14 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-400 mt-8 tracking-wide">
            Sign In
          </h2>
          {error && (
            <p className="text-red-500 mb-4 text-center">{error}</p>
          )}

          <div className="mb-5">
            <label
              className="block text-blue-200 mb-2 font-semibold"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-blue-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-blue-200 mb-2 font-semibold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-blue-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 py-3 rounded-lg font-bold text-lg text-white shadow-md transition-all duration-200"
          >
            Login
          </button>

          <div className="mt-6 text-center text-blue-200 text-sm">
            <span>Don't have an account? </span>
            <a
              href="/register"
              className="text-blue-400 hover:underline font-semibold"
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
