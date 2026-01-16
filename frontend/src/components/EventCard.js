import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likeEvent } from "../actions/eventActions";

export default function EventCard({ event }) {
  if (!event) return null;

  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userLogin.userInfo);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Handle past dates
    if (diffDays < 0) {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatDateOnly = (dateString) => {
    const date = new Date(dateString);
    return formatDate(dateString);
  };

  const formatTimeOnly = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const truncateLocation = (location, maxLength = 35) => {
    if (!location || typeof location !== 'string') return 'Location not specified';
    if (location.length <= maxLength) return location;
    return location.substring(0, maxLength - 3) + '...';
  };

  const getStatusBadge = () => {
    const ratio = event.seats_left / event.capacity;
    if (ratio < 0.1) return { text: 'Almost full', color: 'pink' };
    if (ratio < 0.3) return { text: 'Going fast', color: 'pink' };
    if (ratio < 0.5) return { text: 'Sales end soon', color: 'purple' };
    return null;
  };

  const getAvailabilityColor = () => {
    const ratio = event.seats_left / event.capacity;
    if (ratio > 0.5) return '#10b981'; // green
    if (ratio > 0.2) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Music': '🎵',
      'Nightlife': '🌃',
      'Performing & Visual': '🎭',
      'Business': '💼',
      'Food & Drink': '🍕',
      'Hobbies': '🎮',
      'Dating': '💕',
      'Halloween': '🎃'
    };
    return icons[category] || '🎫';
  };

  const handleLike = async () => {
    if (!userInfo) return;
    try {
      const result = await dispatch(likeEvent(event.id));
      setIsLiked(result.liked);
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  return (
    <article
      className="event-card-enhanced"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="event-card-inner">
        {/* Image Section */}
        <div className="event-image-container">
          {event.poster ? (
            <img
              src={event.poster}
              alt={event.title}
              className="event-image"
            />
          ) : (
            <div className="event-image-placeholder">
              <div className="placeholder-icon">
                <i className="bi bi-image"></i>
              </div>
              <div className="placeholder-text">Event Poster</div>
              <div className="placeholder-pattern"></div>
            </div>
          )}

          {/* Badges */}
          <div className="event-badges">
            {(() => {
              const statusBadge = getStatusBadge();
              return (
                <>
                  {statusBadge && (
                    <div className={`badge-status badge-${statusBadge.color}`}>
                      {statusBadge.text}
                    </div>
                  )}
                  {event.category && (
                    <div className="badge-category">
                      <span className="me-1">{getCategoryIcon(event.category.name)}</span>
                      {event.category.name}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Hover Overlay */}
          <div className={`event-overlay ${isHovered ? 'active' : ''}`}>
            <div className="overlay-content">
              <Link to={`/event/${event.id}`} className="btn-view-event">
                <i className="bi bi-eye-fill me-2"></i>
                View Details
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="preview-content">
          <div className="preview-header-content">
            <h4 className="preview-event-title">{event.title}</h4>
            <div className="preview-rating">
              <div className="rating-stars">
                {[1,2,3,4,5].map(i => (
                  <i key={i} className="bi bi-star-fill"></i>
                ))}
              </div>
              <span className="rating-text">New</span>
            </div>
          </div>

          <p className="preview-description">
            {event.description || "Your event description will appear here. Make it engaging and informative to attract more attendees."}
          </p>

          <div className="preview-meta">
            <div className="meta-item">
              <i className="bi bi-geo-alt-fill"></i>
              <span>{truncateLocation(event?.location)}</span>
            </div>
            <div className="meta-item">
              <i className="bi bi-calendar-event-fill"></i>
              <span>{event?.start_datetime ? formatDateOnly(event.start_datetime) : 'Date TBA'}</span>
            </div>
            <div className="meta-item">
              <i className="bi bi-clock-fill"></i>
              <span>{event?.start_datetime ? formatTimeOnly(event.start_datetime) : 'Time TBA'}</span>
            </div>
          </div>

          <div className="preview-footer">
            <div className="availability-info">
              <div className="availability-text">
                <span className="capacity-text">
                  {event.capacity === null || event.capacity === 0 
                    ? "Unlimited capacity" 
                    : `${event.seats_left || event.capacity} seats available`}
                </span>
              </div>
            </div>
            {userInfo ? (
              <Link to={`/event/${event.id}`} className="btn btn-primary btn-book-preview">
                <i className="bi bi-ticket-perforated me-2"></i>
                Book Now
              </Link>
            ) : (
              <button 
                className="btn btn-primary btn-book-preview"
                onClick={() => window.location.href = '/login'}
                title="Please login to book events"
              >
                Login <i className="bi bi-arrow-right ms-1"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}


