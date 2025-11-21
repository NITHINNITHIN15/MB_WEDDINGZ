import React, { useEffect, useRef, useState, useMemo } from "react";
import API from "../api/axios";
import "./Gallery.css";

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  const scrollRef = useRef(null);

  const categories = [
    { key: "", label: "All" },
    { key: "christian", label: "Christian Weddings" },
    { key: "hindu", label: "Hindu Weddings" },
    { key: "muslim", label: "Muslim Weddings" },
    { key: "pre-wedding", label: "Pre-wedding Shoots" },
    { key: "other", label: "Other Works" },
  ];

  useEffect(() => {
    fetchGallery();
  }, [category]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const debounce = (func, delay) => {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
      };
    };

    const handleScroll = debounce(updateScrollButtons, 100);
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateScrollButtons);
    updateScrollButtons();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [galleryItems]);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, offsetWidth } = container;
    setShowLeftBtn(scrollLeft > 0);
    setShowRightBtn(scrollLeft + offsetWidth < scrollWidth - 1);
  };

  const scrollGallery = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 400;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const url = category ? `/gallery?category=${category}` : "/gallery";
      const res = await API.get(url);
      setGalleryItems(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch gallery items");
    } finally {
      setLoading(false);
    }
  };

  const groupGalleryItems = (items) => {
    const groups = [];
    const landscapes = [];
    const portraits = [];

    items.forEach((item) => {
      if (item.width > item.height) {
        landscapes.push(item);
      } else {
        portraits.push(item);
      }
    });

    portraits.forEach((item) => groups.push([item]));

    for (let i = 0; i < landscapes.length; i += 2) {
      if (i + 1 < landscapes.length) {
        groups.push([landscapes[i], landscapes[i + 1]]);
      } else {
        groups.push([landscapes[i]]);
      }
    }

    return groups;
  };

  const groupedItems = useMemo(() => groupGalleryItems(galleryItems), [galleryItems]);

  return (
    <div className="gallery-container">
      <h2 className="gallery-header">Our Gallery</h2>
      <p className="gallery-description">
        Explore our diverse collection of wedding photography across different
        cultural ceremonies. Each image tells a unique story of love and celebration.
      </p>

      <br />
      <div className="category-tabs">
        {categories.map(({ key, label }) => (
          <div
            key={key}
            className={`category-tab ${category === key ? "active" : ""}`}
            onClick={() => setCategory(key)}
          >
            {label}
          </div>
        ))}
      </div>

      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && galleryItems.length === 0 && !error && (
        <p className="loading-message">No images found for this category.</p>
      )}

      <div className="gallery-scroll-wrapper">
        {showLeftBtn && (
          <button className="scroll-btn left" onClick={() => scrollGallery("left")}>
            &#8249;
          </button>
        )}

        <div className="gallery-scroll-container" ref={scrollRef}>
          {groupedItems.slice(0, 15).map((group, i) =>
            group.length === 1 ? (
              <div className="gallery-card" key={group[0]._id}>
                <img
                  loading="lazy"
                  src={`http://localhost:5000${group[0].imageUrl}`}
                  alt="Gallery"
                  className="gallery-image"
                />
              </div>
            ) : (
              <div className="gallery-card-stacked" key={i}>
                {group.map((item) => (
                  <img
                    key={item._id}
                    loading="lazy"
                    src={`http://localhost:5000${item.imageUrl}`}
                    alt="Gallery"
                    className="gallery-image-stacked"
                  />
                ))}
              </div>
            )
          )}
        </div>

        {showRightBtn && (
          <button className="scroll-btn right" onClick={() => scrollGallery("right")}>
            &#8250;
          </button>
        )}
      </div>
    </div>
  );
}
