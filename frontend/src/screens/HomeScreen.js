import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { listEvents } from "../actions/eventActions";
import Loader from "../components/Loader";
import Hero from "../components/Hero";
import EventCard from "../components/EventCard";
import EventFilter from "../components/EventFilter";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, events } = useSelector((s) => s.eventList);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(listEvents(filters));
  }, [dispatch, filters]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newFilters = {};
    
    if (tab === 'all') {
      // Clear all filters
      setFilters({});
    } else if (tab === 'today') {
      // Filter for today's events
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      newFilters.start_after = today.toISOString().split('T')[0];
      newFilters.start_before = tomorrow.toISOString().split('T')[0];
      setFilters(newFilters);
    } else if (tab === 'weekend') {
      // Filter for this weekend (Saturday and Sunday)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dayOfWeek = today.getDay();
      const daysUntilSaturday = (6 - dayOfWeek) % 7 || 7;
      const saturday = new Date(today);
      saturday.setDate(today.getDate() + daysUntilSaturday);
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      const monday = new Date(sunday);
      monday.setDate(sunday.getDate() + 1);
      newFilters.start_after = saturday.toISOString().split('T')[0];
      newFilters.start_before = monday.toISOString().split('T')[0];
      setFilters(newFilters);
    } else if (tab === 'featured') {
      // Filter for featured events
      newFilters.featured = true;
      setFilters(newFilters);
    }
  };

  return (
    <>
      <Hero onSearch={setFilters} />

      <div className="container-fluid px-4">
          {/* Section Header */}
          <div className="section-header-container">
            <div className="section-header-wrapper">
              <h2 className="events-section-title">
                <i className="bi bi-calendar-event me-3"></i>
                Discover Amazing Events
              </h2>
              <p className="events-section-subtitle">
                Explore events happening in your area and find your next adventure
              </p>
            </div>
          </div>

          {/* Enhanced Filter Tabs */}
          <div className="filter-tabs-container">
            <div className="filter-tabs-wrapper">
              <div className="filter-tabs">
                <button
                  className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => handleTabChange('all')}
                >
                  <i className="bi bi-grid me-2"></i>
                  <span className="tab-text">All Events</span>
                  <span className="tab-count">{events?.length || 0}</span>
                </button>
                <button
                  className={`filter-tab ${activeTab === 'today' ? 'active' : ''}`}
                  onClick={() => handleTabChange('today')}
                >
                  <i className="bi bi-sun me-2"></i>
                  <span className="tab-text">Today</span>
                </button>
                <button
                  className={`filter-tab ${activeTab === 'weekend' ? 'active' : ''}`}
                  onClick={() => handleTabChange('weekend')}
                >
                  <i className="bi bi-calendar-week me-2"></i>
                  <span className="tab-text">This Weekend</span>
                </button>
                <button
                  className={`filter-tab ${activeTab === 'featured' ? 'active' : ''}`}
                  onClick={() => handleTabChange('featured')}
                >
                  <i className="bi bi-star me-2"></i>
                  <span className="tab-text">Featured</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Filter Section */}
          <div className="filters-container">
            <EventFilter onChange={setFilters} />
          </div>

          {/* Events Content */}
          <div className="events-content">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <h4 className="loading-text">Finding amazing events...</h4>
                <p className="loading-subtext">Please wait while we load the latest events</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <div className="error-icon">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h3 className="error-title">Oops! Something went wrong</h3>
                <p className="error-message">{String(error)}</p>
                <button
                  className="btn btn-primary error-retry-btn"
                  onClick={() => dispatch(listEvents(filters))}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Try Again
                </button>
              </div>
            ) : !events || events.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="bi bi-search"></i>
                </div>
                <h3 className="empty-title">No Events Found</h3>
                <p className="empty-message">
                  We couldn't find any events matching your criteria. Try adjusting your filters or check back later.
                </p>
                <div className="empty-actions">
                  <button
                    className="btn btn-outline-primary me-3"
                    onClick={() => setFilters({})}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Clear Filters
                  </button>
                  {(() => {
                    const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
                    if (userInfo?.is_staff) {
                      return (
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate('/organizer/create')}
                        >
                          <i className="bi bi-plus-circle me-2"></i>
                          Create Event
                        </button>
                      );
                    } else {
                      return null;
                    }
                  })()}
                </div>
              </div>
            ) : (
              <div className="events-results">
                <div className="results-header">
                  <div className="results-count">
                    <i className="bi bi-calendar-event me-2"></i>
                    <span className="count-number">{events?.length || 0}</span>
                    <span className="count-text">event{(events?.length || 0) !== 1 ? 's' : ''} found</span>
                  </div>
                  <div className="results-sort">
                    <select className="sort-select">
                      <option value="date">Sort by Date</option>
                      <option value="popularity">Sort by Popularity</option>
                      <option value="distance">Sort by Distance</option>
                    </select>
                  </div>
                </div>
                <div className="events-grid-enhanced">
                  {(events || []).map((event) => (
                    <EventCard event={event} key={event.id} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Call to Action Section */}
          {!loading && events && events.length > 0 && (
            <div className="cta-section">
              <div className="cta-card">
                <div className="cta-content">
                  <div className="cta-icon">
                    <i className="bi bi-lightbulb"></i>
                  </div>
                  <div className="cta-text">
                    <h3 className="cta-title">Have an Event in Mind?</h3>
                    <p className="cta-description">
                      Share your event with the community and connect with like-minded people
                    </p>
                  </div>
                  <div className="cta-action">
                    {(() => {
                      const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
                      if (userInfo?.is_staff) {
                        return (
                          <button
                            className="btn btn-primary btn-cta"
                            onClick={() => navigate('/organizer/create')}
                          >
                            <i className="bi bi-plus-circle-fill me-2"></i>
                            Create Your Event
                          </button>
                        );
                      } else if (userInfo) {
                        return (
                          <button
                            className="btn btn-primary btn-cta"
                            disabled
                            title="Only admins can create events"
                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                          >
                            <i className="bi bi-plus-circle-fill me-2"></i>
                            Create Your Event
                          </button>
                        );
                      } else {
                        return (
                          <button
                            className="btn btn-primary btn-cta"
                            onClick={() => navigate('/login')}
                          >
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Login to Create Event
                          </button>
                        );
                      }
                    })()}
                  </div>
                </div>
                <div className="cta-decoration">
                  <div className="decoration-circle circle-1"></div>
                  <div className="decoration-circle circle-2"></div>
                  <div className="decoration-circle circle-3"></div>
                </div>
              </div>
            </div>
          )}
        </div>
    </>
  );
}


