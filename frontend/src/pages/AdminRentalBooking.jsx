import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./AdminRentalBooking.css";

export default function AdminRentalBookings() {
  const [bookings, setBookings] = useState([]);
  const [sortKey, setSortKey] = useState("rentalStart");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    axios
      .get("/rental-bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Failed to fetch bookings", err));
  }, []);

  const handleStatusChange = (id, status) => {
    axios
      .put(`/rental-bookings/${id}`, { status })
      .then(() => {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status } : b))
        );
      })
      .catch((err) => {
        console.error("Status update failed", err);
        alert("Failed to update status");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    axios
      .delete(`/rental-bookings/${id}`)
      .then(() => {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        alert("Booking deleted successfully.");
      })
      .catch((err) => {
        console.error("Delete failed", err);
        alert("Failed to delete booking.");
      });
  };

  const sortBookings = (key) => {
    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newOrder);

    setBookings((prev) =>
      [...prev].sort((a, b) => {
        const aVal = key === "totalPrice" ? a[key] : new Date(a[key]);
        const bVal = key === "totalPrice" ? b[key] : new Date(b[key]);
        return newOrder === "asc" ? aVal - bVal : bVal - aVal;
      })
    );
  };

  return (
    <div className="admin-booking-page">
      {/* <h2>Rental Bookings</h2> */}

      <div className="booking-controls">
        <label>Sort By: </label>
        <select onChange={(e) => sortBookings(e.target.value)} value={sortKey}>
          <option value="rentalStart">Rental Start Date</option>
          <option value="totalPrice">Total Price</option>
        </select>
      </div>

      <div className="booking-table">
        <div className="booking-row booking-header">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Item</div>
          <div>From</div>
          <div>To</div>
          <div>Days</div>
          <div>Total ₹</div>
          <div>Status</div>
          <div>Actions</div> {/* NEW */}
        </div>

        {bookings.map((b) => {
          const rentalStart = new Date(b.rentalStart);
          const rentalEnd = new Date(b.rentalEnd);
          const days =
            Math.ceil((rentalEnd - rentalStart) / (1000 * 60 * 60 * 24)) + 1;
          const isOverdue = rentalEnd < new Date();

          return (
            <div
              className={`booking-row ${isOverdue ? "overdue-booking" : ""}`}
              key={b._id}
            >
              <div data-label="Name">{b.name}</div>
              <div data-label="Email">{b.email}</div>
              <div data-label="Phone">{b.phone}</div>
              <div data-label="Item">{b.item?.name || "N/A"}</div>
              <div data-label="From">{rentalStart.toLocaleDateString()}</div>
              <div data-label="To">{rentalEnd.toLocaleDateString()}</div>
              <div data-label="Days">{days}</div>
              <div data-label="Total ₹">₹{b.totalPrice}</div>
              <div data-label="Status">
                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Returned">Returned</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div data-label="Actions">
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(b._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
