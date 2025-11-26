import React, { useState } from "react";
import API from "../api/axios";
import "./BookingForm.css";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    location: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      // Trim string values to prevent backend validation errors
      const payload = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [
          k,
          typeof v === "string" ? v.trim() : v,
        ])
      );

      const res = await API.post("/bookings", payload);

      if (res.status === 201) {
        setFeedback({ type: "success", message: "Booking submitted successfully!" });
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventDate: "",
          eventType: "",
          location: "",
          message: "",
        });
        setTimeout(() => {
    setFeedback({ type: "", message: "" });
  }, 1000);
      }
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      let errorMsg = "Submission failed. Please try again.";
      if (err.response?.data?.errors) {
        errorMsg = err.response.data.errors.map((e) => e.msg).join(", ");
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setFeedback({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="booking-container">
      <h2>Book Your Session</h2>
      <p className="subtext">
        Ready to capture your special day? Fill out the form below to request a
        booking. We'll get back to you within 24–48 hours.
      </p>

      <form className="booking-grid" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your contact number"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="eventDate">Service Date</label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="eventType">Service Type</label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
          >
            <option value="">Select ceremony type</option>
            <option value="WeddingPhotography">Wedding Photography</option>
            <option value="PreWeddingShoots">Pre-Wedding Shoots</option>
            <option value="CulturalCeremonies">Cultural Ceremonies</option>
            <option value="FamilyPortraits">Family Portraits</option>
            <option value="MaternityInfantShoots">Maternity & Infant Shoots</option>
            <option value="EventCoverage">Event Coverage</option>
            <option value="CouplePortraitShoots">Couple Portrait Shoots</option>
            <option value="CommercialShoots">Commercial Shoots</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="location">Service Location</label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Your Location"
            required
          />
        </div>

        <div className="form-field full">
          <label htmlFor="message">Additional Details</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about your special day..."
            required
          />
        </div>

        {feedback.message && (
          <p className={feedback.type === "error" ? "error" : "success"}>
            {feedback.message}
          </p>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Booking Request"}
        </button>
      </form>
    </section>
  );
}
