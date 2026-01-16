import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import { Navigate, Link } from "react-router-dom";

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((s) => s.userRegister);
  const [form, setForm] = useState({ username: "", email: "", password: "", first_name: "", last_name: "" });
  
  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => document.body.classList.remove("auth-page");
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); dispatch(register(form)); };
  if (userInfo?.access) return <Navigate to="/" />;

  return (
    <div className="register-container" style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="register-bg-accent" aria-hidden="true" style={{
        background: 'radial-gradient(circle at 50% 36%, #dae4fa 60%, #c7d8f8 100%)',
        width: '100vw',
        height: '100vh',
        borderRadius: '0 0 48% 48%/0 0 42% 42%',
        filter: 'blur(2px)',
        opacity: 0.7,
      }} />
      <div className="register-card">
        <div className="logo-circle"><span className="logo-text">EH</span></div>
        <h2>Create Account</h2>
        <div className="register-desc">Join EventHub and start exploring amazing events</div>
        {error && (
          <div className="error-msg">
            {typeof error === 'string' ? error : typeof error === 'object' && error.message ? error.message : 'An error occurred. Please try again.'}
              </div>
        )}
        <form onSubmit={submit} autoComplete="on">
          <div className="form-row">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={change}
              autoComplete="given-name"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={change}
              autoComplete="family-name"
            />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={change}
            required
            autoComplete="username"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={change}
            required
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={change}
            required
            autoComplete="new-password"
          />
          <button type="submit" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className="login-link">
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}


