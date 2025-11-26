import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data;

      localStorage.setItem("userToken", token);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role);

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="auth-container">
        <h2>Welcome Back</h2>
        <p className="auth-quote">“Where every love story becomes a timeless memory.”</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="auth-link" onClick={() => navigate("/signup")}>
            Don't have an account? Signup
          </p>
        </form>
      </div>
    </div>
  );
}
