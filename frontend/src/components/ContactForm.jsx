import React, { useState } from "react";
import API from "../api/axios";
import "./ContactForm.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await API.post("/contacts", formData);
      setSuccess("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-left">
        <div className="contact-left-content">
          <h1 className="big-heading">We’d Love to Hear From You</h1>
          <p className="subtext">
            Reach out for collaborations, questions, or just a friendly hello.
            We're here to help and connect.
          </p>
          <div className="decorative-box">MB_WEDDINGS</div>
        </div>
      </div>

      <div className="contact-right">
        <h2 className="contact-heading">FOR ENQUIRIES CONTACT</h2>
        <br />
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows="5"
            ></textarea>
          </div>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Sending..." : "Send Message"}
          </button>
          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
