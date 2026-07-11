import React, { useState } from "react";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const AuthModal = ({ isOpen, onClose }) => {
  const { login, signup, loading, error: authError } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all fields");
      return;
    }

    let success;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await signup(name, email, password, isAdmin ? "admin" : "user");
    }

    if (success) {
      onClose();
      setName("");
      setEmail("");
      setPassword("");
      setIsAdmin(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-base-100 border border-base-300 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-base-200 transition-colors text-base-content/70 hover:text-base-content"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl font-black text-primary">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-base-content/60">
            {isLogin
              ? "Sign in to access and sync your notes & course progress"
              : "Register to save your learning journey on the server"}
          </p>
        </div>

        {/* Error Alert */}
        {(error || authError) && (
          <div className="p-3.5 bg-error/10 border border-error/20 text-error rounded-2xl text-xs font-semibold">
            {error || authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="form-control">
              <label className="label text-xs font-bold text-base-content/75 mb-1">
                Name
              </label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-3 text-base-content/40" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full rounded-xl pl-10 text-sm focus:border-primary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-control">
            <label className="label text-xs font-bold text-base-content/75 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3 text-base-content/40" />
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full rounded-xl pl-10 text-sm focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label text-xs font-bold text-base-content/75 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3 text-base-content/40" />
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full rounded-xl pl-10 text-sm focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-control">
              <label className="flex items-center gap-2 cursor-pointer py-1 select-none">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm rounded-lg"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <span className="text-xs font-bold text-base-content/75">
                  Register as Administrator
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary rounded-xl w-full mt-2 font-bold flex gap-2 items-center justify-center shadow-lg"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-base-content/75">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="font-bold text-primary hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
