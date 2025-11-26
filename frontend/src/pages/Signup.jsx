import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <h2>Create Account</h2>

        {error && <p className="signup-error">{error}</p>}

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

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

          <button type="submit">Signup</button>

          <p className="signup-link" onClick={() => navigate("/login")}>
            Already have an account? Login
          </p>
        </form>
      </div>
    </div>
  );
}
