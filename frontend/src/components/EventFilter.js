import React, { useState } from "react";

export default function EventFilter({ onChange }) {
  const [query, setQuery] = useState({ search: "", location: "", category: "", start_after: "" });
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { value: "", label: "All Categories", icon: "bi-grid" },
    { value: "Music", label: "Music", icon: "bi-music-note" },
    { value: "Nightlife", label: "Nightlife", icon: "bi-moon-stars" },
    { value: "Performing & Visual", label: "Arts", icon: "bi-palette" },
    { value: "Business", label: "Business", icon: "bi-briefcase" },
    { value: "Food & Drink", label: "Food & Drink", icon: "bi-cup-hot" },
    { value: "Hobbies", label: "Hobbies", icon: "bi-controller" },
    { value: "Dating", label: "Dating", icon: "bi-heart" },
    { value: "Halloween", label: "Halloween", icon: "bi-emoji-smile" },
  ];

  const update = (e) => {
    const next = { ...query, [e.target.name]: e.target.value };
    setQuery(next);
    onChange(next);
  };

  const clearAll = () => {
    const reset = { search: "", location: "", category: "", start_after: "" };
    setQuery(reset);
    onChange(reset);
  };

  const hasActiveFilters = Object.values(query).some(value => value !== "");

  return (
    <div className="event-filter-enhanced">
      {/* Filter Toggle for Mobile */}
      <div className="filter-toggle d-lg-none">
        <button
          className="btn btn-outline-primary filter-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <i className="bi bi-funnel me-2"></i>
          Filters
          {hasActiveFilters && <span className="filter-count ms-2">{Object.values(query).filter(v => v !== "").length}</span>}
          <i className={`bi ms-2 transition-transform ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
        </button>
      </div>

      {/* Filter Content */}
      <div className={`filter-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-grid">
          {/* Search Input */}
          <div className="filter-item search-filter">
            <div className="filter-input-wrapper">
              <div className="input-icon">
                <i className="bi bi-search"></i>
              </div>
              <input
                name="search"
                className="filter-input"
                placeholder="Search events, artists, venues..."
                value={query.search}
                onChange={update}
              />
              {query.search && (
                <button
                  className="input-clear"
                  onClick={() => update({ target: { name: 'search', value: '' } })}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          {/* Location Input */}
          <div className="filter-item location-filter">
            <div className="filter-input-wrapper">
              <div className="input-icon">
                <i className="bi bi-geo-alt"></i>
              </div>
              <input
                name="location"
                className="filter-input"
                placeholder="Location or city"
                value={query.location}
                onChange={update}
              />
              {query.location && (
                <button
                  className="input-clear"
                  onClick={() => update({ target: { name: 'location', value: '' } })}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          {/* Category Select */}
          <div className="filter-item category-filter">
            <div className="filter-select-wrapper">
              <div className="select-icon">
                <i className="bi bi-tag"></i>
              </div>
              <select
                name="category"
                className="filter-select"
                value={query.category}
                onChange={update}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="select-arrow">
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>
          </div>

          {/* Date Input */}
          <div className="filter-item date-filter" style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch' }}>
            <div className="filter-input-wrapper" style={{ flex: 1 }}>
              <div className="input-icon">
                <i className="bi bi-calendar-date"></i>
              </div>
              <input
                name="start_after"
                type="date"
                className="filter-input"
                value={query.start_after}
                onChange={update}
                min={new Date().toISOString().split('T')[0]}
              />
              {query.start_after && (
                <button
                  className="input-clear"
                  onClick={() => update({ target: { name: 'start_after', value: '' } })}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary clear-filters-btn"
              onClick={clearAll}
              disabled={!hasActiveFilters}
              style={{ whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'stretch' }}
            >
              <i className="bi bi-x-circle me-2"></i>
              Clear All
            </button>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          <div className="filter-stats">
            {hasActiveFilters && (
              <span className="active-filters-count">
                <i className="bi bi-filter me-1"></i>
                {Object.values(query).filter(v => v !== "").length} filter{Object.values(query).filter(v => v !== "").length !== 1 ? 's' : ''} active
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


