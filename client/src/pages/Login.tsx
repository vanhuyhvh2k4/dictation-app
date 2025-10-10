// src/pages/Login.tsx
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20">
        <a href="#" className="text-sm text-gray-500 mb-6">
          ← Back to dashboard
        </a>

        <h2 className="text-3xl font-bold mb-2">Sign In</h2>
        <p className="text-gray-600 mb-6">
          Enter your email and password to sign in!
        </p>

        {/* Social Login */}
        <div className="flex gap-4 mb-6">
          <button className="flex items-center justify-center w-1/2 border rounded-lg py-2 gap-2 hover:bg-gray-50">
            <FcGoogle className="text-xl" /> Sign in with Google
          </button>
          <button className="flex items-center justify-center w-1/2 border rounded-lg py-2 gap-2 hover:bg-gray-50">
            <FaXTwitter className="text-xl" /> Sign in with X
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="text-gray-400 text-sm">Or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="info@gmail.com"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" /> Keep me logged in
            </label>
            <a href="#" className="text-indigo-500 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
          >
            Sign in
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="#" className="text-indigo-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>

      {/* Right Panel */}
      <div className="hidden md:flex w-1/2 bg-indigo-900 text-white items-center justify-center relative">
        <div className="text-center px-10">
          <h2 className="text-2xl font-bold">TailAdmin</h2>
          <p className="mt-3 text-gray-300">
            Free and Open-Source Tailwind CSS Admin Dashboard Template
          </p>
        </div>
      </div>
    </div>
  );
}
