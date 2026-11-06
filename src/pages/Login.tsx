import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 1. The official Kimi OAuth Login URL (from your .env)
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL || "https://auth.kimi.com";
  const appId = import.meta.env.VITE_APP_ID || "your_app_id";

  // This is the standard OAuth redirect URL (adjust if your backend expects a different route)
  const oauthLoginUrl = `${kimiAuthUrl}/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(window.location.origin + "/api/auth/callback")}&response_type=code`;

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Access</h1>
        
        {/* --- OPTION 1: KIMI OAUTH LOGIN --- */}
        <div className="space-y-4 mb-6">
          <a
            href={oauthLoginUrl}
            className="w-full flex justify-center items-center bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            Sign in with Kimi
          </a>
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or use Developer Bypass</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        </div>

        {/* --- OPTION 2: DEVELOPER BYPASS --- */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TEMPORARY BYPASS: Allows you to log in with a hardcoded password
            if (password === "admin123") {
              navigate("/admin");
            } else {
              alert("Wrong password! Hint: use admin123");
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Developer Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Enter admin123 to bypass..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Bypass & Enter Dashboard
          </button>
        </form>

      </div>
    </div>
  );
}