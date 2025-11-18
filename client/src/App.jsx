import { Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <nav className="w-full bg-gray-900 text-white px-6 py-3 flex justify-between shadow">
        <div className="font-bold text-lg">Finance Tracker</div>

        <div className="flex gap-4">
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>

          {!token && (
            <>
              <Link to="/signin" className="hover:text-blue-400">
                Sign In
              </Link>
              <Link to="/signup" className="hover:text-blue-400">
                Sign Up
              </Link>
            </>
          )}

          {token && (
            <>
              <Link to="/profile" className="hover:text-blue-400">
                Profile
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Routes>
      </div>
    </>
  );
}
