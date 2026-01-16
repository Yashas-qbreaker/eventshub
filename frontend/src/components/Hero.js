import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero({ onSearch }) {
  const navigate = useNavigate();
  const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:8000";
  
  const slides = [
    {
      url: `${apiBase}/media/banners/music-concert-banner.png`,
      headline: "Discover Amazing Events",
      subtitle: "Find and attend the best events happening around you",
      cta: "Explore Events",
      action: () => navigate("/"),
      icon: "🎉"
    },
    {
      url: `${apiBase}/media/banners/technology-future-banner.png`,
      headline: "Create Your Event",
      subtitle: "Organize and share your events with the world",
      cta: "Start Creating",
      action: () => navigate("/organizer/create"),
      icon: "✨"
    },
    {
      url: `${apiBase}/media/banners/cultural-image.png`,
      headline: "Connect & Network",
      subtitle: "Meet like-minded people and build lasting connections",
      cta: "Join Now",
      action: () => navigate("/register"),
      icon: "🤝"
    },
    {
      url: `${apiBase}/media/banners/data-science-event-banner.png`,
      headline: "Learn & Grow",
      subtitle: "Expand your knowledge with expert-led events",
      cta: "Explore Events",
      action: () => navigate("/"),
      icon: "📚"
    },
  ];

  const categories = [
    { icon: "🎃", label: "Halloween", color: "#ff6b6b", gradient: "linear-gradient(135deg, #ff6b6b, #ff4757)" },
    { icon: "🎵", label: "Music", color: "#4ecdc4", gradient: "linear-gradient(135deg, #4ecdc4, #26d0ce)" },
    { icon: "🌃", label: "Nightlife", color: "#45b7d1", gradient: "linear-gradient(135deg, #45b7d1, #3498db)" },
    { icon: "🎭", label: "Performing & Visual", color: "#f9ca24", gradient: "linear-gradient(135deg, #f9ca24, #f39c12)" },
    { icon: "💕", label: "Dating", color: "#f0932b", gradient: "linear-gradient(135deg, #f0932b, #e67e22)" },
    { icon: "🎮", label: "Hobbies", color: "#eb4d4b", gradient: "linear-gradient(135deg, #eb4d4b, #e74c3c)" },
    { icon: "💼", label: "Business", color: "#6c5ce7", gradient: "linear-gradient(135deg, #6c5ce7, #8e44ad)" },
    { icon: "🍕", label: "Food & Drink", color: "#a29bfe", gradient: "linear-gradient(135deg, #a29bfe, #9b59b6)" },
  ];

  const [idx, setIdx] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const onCategoryClick = (label) => {
    if (onSearch) onSearch({ category: label });
    window.scrollTo({ top: document.body.scrollHeight / 3, behavior: "smooth" });
  };

  return (
    <>
      <section className={`hero-carousel position-relative ${isLoaded ? 'hero-loaded' : ''}`}>
        <div className="hero-background">
          <img 
            src={slides[idx].url} 
            alt={slides[idx].headline}
            className="w-100 hero-slide"
            loading="eager"
            onError={(e) => {
              console.error('Failed to load hero image:', slides[idx].url);
              // Keep image visible but show error state
              e.target.style.opacity = '0.3';
            }}
            onLoad={(e) => {
              e.target.style.opacity = '1';
            }}
          />
          <div className="hero-background-overlay"></div>
        </div>
        <div
          className="hero-overlay"
        >
          <div className="container-fluid px-4">
            <div className="row justify-content-center text-center">
              <div className="col-lg-10 col-xl-8">
                <div className="hero-content">
                  <div className="hero-icon mb-2">
                    <span style={{ fontSize: '2.5rem' }}>{slides[idx].icon}</span>
                  </div>
                  <h1 className="display-2 fw-bold mb-3 hero-headline">
                    {slides[idx].headline}
                  </h1>
                  <p className="lead mb-4 fs-4 hero-subtitle">
                    {slides[idx].subtitle}
                  </p>
                  <div className="hero-actions">
                    <button className="btn btn-light btn-xl px-5 py-3 me-3 hero-cta" onClick={slides[idx].action}>
                      <i className="bi bi-arrow-right-circle me-2"></i>
                      {slides[idx].cta}
                    </button>
                    <button className="btn btn-outline-light btn-xl px-4 py-3 hero-secondary" onClick={() => window.scrollTo({ top: document.body.scrollHeight / 3, behavior: "smooth" })}>
                      Browse Categories
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <button className="hero-nav hero-prev" onClick={prev} aria-label="Previous slide">
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="hero-nav hero-next" onClick={next} aria-label="Next slide">
          <i className="bi bi-chevron-right"></i>
        </button>

        {/* Enhanced Slide Indicators */}
        <div className="hero-indicators">
          <div className="d-flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hero-indicator ${i === idx ? 'active' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
              >
                <div className="indicator-dot"></div>
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* Enhanced Categories Section */}
      <div className="container-fluid px-4 categories-section-wrapper">
          <div className="categories-header text-center mb-4">
            <h2 className="categories-title">Explore Categories</h2>
            <p className="categories-subtitle">Find events that match your interests</p>
          </div>
          <div className="categories-scroll d-flex gap-4 justify-content-center">
            {categories.map((category, index) => (
              <div
                key={category.label}
                className="category-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="category-circle mx-auto"
                  style={{ background: category.gradient, cursor: 'pointer' }}
                  onClick={() => onCategoryClick(category.label)}
                >
                  <div className="category-icon">
                    <span style={{ fontSize: '2.5rem' }}>{category.icon}</span>
                  </div>
                  <div className="category-glow"></div>
                </div>
                <div className="category-label">{category.label}</div>
              </div>
            ))}
          </div>
        </div>
    </>
  );
}


