import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Rental.css";
import RentalBookingForm from "./RentalBookingForm";

export default function Rental() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    axios
      .get("/rentals")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Failed to fetch rental items:", err));
  }, []);

  const categories = ["Camera", "Lens", "Accessory"];

  return (
    <section id="rental" className="rental-section">
      <h2 className="section-title">Rental Equipment</h2>

      {categories.map((category) => {
        const filtered = items.filter((item) => item.type === category);
        if (filtered.length === 0) return null;

        return (
          <div key={category} className="rental-category">
            <h3 className="rental-category-title">{category}</h3>
            <div className="rental-scroll-row">
              {filtered.map((item) => (
                <div key={item._id} className="rental-card">
                  <img
                    src={`http://localhost:5000${item.imageUrl}`}
                    alt={item.name}
                  />
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>
                    <strong>₹{item.pricePerDay}/day</strong>
                  </p>
                  <button
                    disabled={!item.availability}
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.availability ? "Rent Now" : "Unavailable"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Rental Booking Form Modal */}
      {selectedItem && (
        <RentalBookingForm
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
}
