import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/lib/trpc"; 

export default function Login() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      // On success, redirect to the admin dashboard
      navigate("/admin");
    },
    onError: (err) => {
      alert("Login failed: " + err.message);
    },
  });

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate({ password });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Enter password..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
