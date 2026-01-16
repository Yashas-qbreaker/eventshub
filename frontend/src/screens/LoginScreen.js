import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userActions";
import { Navigate, Link } from "react-router-dom";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((s) => s.userLogin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => document.body.classList.remove("auth-page");
  }, []);

  const submit = (e) => { e.preventDefault(); dispatch(login(username, password)); };
  if (userInfo?.access) return <Navigate to="/" />;

  return (
    <div className="login-container" style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="login-bg-accent" aria-hidden="true" style={{
        background: 'radial-gradient(circle at 50% 36%, #dae4fa 60%, #c7d8f8 100%)',
        width: '100vw',
        height: '100vh',
        borderRadius: '0 0 48% 48%/0 0 42% 42%',
        filter: 'blur(2px)',
        opacity: 0.7,
      }} />
      <div className="login-card">
        <div className="logo-circle"><span className="logo-text">EH</span></div>
        <h2>Welcome Back</h2>
        <div className="login-desc">Sign in to your EventHub account</div>
        {error && (
          <div className="error-msg">
            {typeof error === 'string' ? error : typeof error === 'object' && error.message ? error.message : 'An error occurred. Please try again.'}
                </div>
        )}
        <form onSubmit={submit} autoComplete="on">
                      <input
            type="text"
            placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
            autoComplete="username"
                      />
                      <input
                        type="password"
            placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
            autoComplete="current-password"
                      />
          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
                  </button>
                </form>
        <div className="signup-link">
          Don't have an account?
          <Link to="/register">Sign up here</Link>
        </div>
      </div>
    </div>
  );
}


