import React, { useContext, useState } from "react";

import { Alert, Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import login from "../assets/login.png";

import { AuthContext } from "../context/AuthContext";

export const Login = () => {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuthUser } = useContext(AuthContext);
  const [error, setError] = useState(null);

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setError(data.message);
      }
      if (res.ok) {
        if (data.role === "admin" || data.role === "superAdmin") {
          localStorage.setItem("user", JSON.stringify(data));
          setAuthUser(data);
          navigate("/dashboard");
        } else {
          setError("You are not admin");
        }
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-teal-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-xl">
        {/* Left Section - Image with Overlay */}
        <div className="md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-500/20 to-cyan-600/40 z-10"></div>
          <img
            src={login}
            alt="Login Illustration"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white z-20">
            <h3 className="text-2xl font-bold mb-2">Welcome Back</h3>
            <p className="text-sm opacity-90">
              Secure access to your dashboard
            </p>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="md:w-1/2 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Form Header with Icon */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-cyan-100 dark:bg-cyan-900 rounded-full shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-cyan-600 dark:text-cyan-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Sign In
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Enter your credentials to continue
              </p>
            </div>

            {/* Email Input with Icon */}
            <div>
              <Label
                htmlFor="email"
                value="Email Address"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              />
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, [e.target.id]: e.target.value })
                  }
                />
              </div>
            </div>

            {/* ID Input with Icon */}
            <div>
              <Label
                htmlFor="id"
                value="User ID"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              />
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <TextInput
                  id="id"
                  type="text"
                  required
                  placeholder="Enter your ID"
                  className="pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, [e.target.id]: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password Input with Toggle */}
            <div>
              <Label
                htmlFor="password"
                value="Password"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              />
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, [e.target.id]: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {/*<div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  className="text-cyan-600 focus:ring-cyan-500 border-gray-300 dark:border-gray-600"
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <Label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </Label>
              </div>
              <a
                href="#"
                className="text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                Forgot password?
              </a>
            </div>*/}

            {/* Submit Button with Animation */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center"
            >
              Sign In
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </Button>
            {error && (
              <Alert color="failure">
                <span className="font-medium">{error}</span>
              </Alert>
            )}

            {/* Footer Links */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                Don't have an account?{" "}
                <a
                  href="#"
                  className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
                >
                  Contact super admin
                </a>
              </p>
              <p className="mt-2 text-xs">
                By continuing, you agree to our{" "}
                <a href="#" className="text-cyan-600 dark:text-cyan-400">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-cyan-600 dark:text-cyan-400">
                  Privacy Policy
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
