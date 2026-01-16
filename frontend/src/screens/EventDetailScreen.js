import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getEventDetails, rsvpEvent, likeEvent } from "../actions/eventActions";
import Loader from "../components/Loader";

export default function EventDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, event } = useSelector((s) => s.eventDetails);
  const rsvp = useSelector((s) => s.eventRsvp);
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => { dispatch(getEventDetails(id)); }, [dispatch, id]);

  const onRsvp = () => dispatch(rsvpEvent(id));

  const handleLike = async () => {
    if (!userInfo) return;
    try {
      const result = await dispatch(likeEvent(event.id));
      setIsLiked(result.liked);
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger text-center" style={{
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {String(error)}
      </div>
    </div>
  );
  if (!event?.id) return null;

  return (
    <div className="event-detail-screen">
      <div className="container-fluid px-4">
        {/* Back Button */}
        <div className="mb-4">
          <button
            className="btn btn-outline-secondary back-btn"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Events
          </button>
        </div>

        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="event-detail-card">
              {/* Poster Image */}
              <div className="event-poster-container">
                {event.poster ? (
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="event-poster"
                  />
                ) : (
                  <div className="event-poster-placeholder">
                    <div className="placeholder-icon">🎫</div>
                    <div className="placeholder-text">Event Image</div>
                  </div>
                )}

                {/* Badges */}
                <div className="event-badges">
                  {event.featured && (
                    <div className="badge-featured">
                      <i className="bi bi-star-fill me-1"></i>
                      Featured
                    </div>
                  )}
                  {event.category && (
                    <div className="badge-category">
                      <i className="bi bi-tag-fill me-1"></i>
                      {event.category.name}
                    </div>
                  )}
                </div>

                {/* Like Button */}
                <button
                  className={`btn-favorite ${isLiked ? 'liked' : ''} ${!userInfo ? 'disabled' : ''}`}
                  onClick={userInfo ? handleLike : () => navigate('/login')}
                  title={!userInfo ? 'Please login to save events' : (isLiked ? 'Remove from watchlist' : 'Add to watchlist')}
                  disabled={!userInfo}
                >
                  <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
              </div>

              {/* Event Content */}
              <div className="event-content">
                <div className="event-header">
                  <h1 className="event-title">{event.title}</h1>
                  <div className="event-rating">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`bi ${i < 4 ? 'bi-star-fill' : 'bi-star'}`}></i>
                      ))}
                    </div>
                    <span className="rating-text">4.2 (128 reviews)</span>
                  </div>
                </div>

                <div className="event-meta">
                  <div className="meta-item">
                    <i className="bi bi-calendar-event-fill"></i>
                    <span>{formatDate(event.start_datetime)}</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-clock-fill"></i>
                    <span>{formatTime(event.start_datetime)}</span>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="event-description">
                  <h3>About This Event</h3>
                  <p>{event.description}</p>
                </div>

                {/* Organizer Info */}
                {event.organizer && (
                  <div className="event-organizer">
                    <h4>Organized by</h4>
                    <div className="organizer-info">
                      <div className="organizer-avatar">
                        {event.organizer.avatar ? (
                          <img src={event.organizer.avatar} alt={event.organizer.username} />
                        ) : (
                          <div className="avatar-placeholder">
                            {event.organizer.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="organizer-details">
                        <div className="organizer-name">{event.organizer.username}</div>
                        <div className="organizer-stats">Event Organizer</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="event-sidebar">
              {/* RSVP Card */}
              <div className="rsvp-card">
                <div className="availability-section">
                  <div className="availability-header">
                    <span className="availability-label">Tickets Available</span>
                    <span className="availability-count">{event.seats_left} / {event.capacity}</span>
                  </div>
                  <div className="availability-bar">
                    <div
                      className="availability-fill"
                      style={{
                        width: `${(event.seats_left / event.capacity) * 100}%`,
                        backgroundColor: event.seats_left > event.capacity * 0.5 ? '#10b981' :
                                       event.seats_left > event.capacity * 0.2 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <div className="availability-text">
                    {event.seats_left > 0 ? `${event.seats_left} seats left` : 'Sold out'}
                  </div>
                </div>

                {userInfo ? (
                  <button
                    className="btn btn-primary btn-rsvp w-100"
                    onClick={onRsvp}
                    disabled={event.seats_left === 0}
                  >
                    {event.seats_left === 0 ? 'Sold Out' : 'RSVP Now'}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-rsvp w-100"
                    onClick={() => navigate('/login')}
                    title="Please login to RSVP"
                  >
                    Login to RSVP
                  </button>
                )}

                {rsvp.ticket && (
                  <div className="ticket-info">
                    <div className="ticket-header">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span className="fw-semibold">You're Going!</span>
                    </div>
                    <div className="ticket-details">
                      <div className="ticket-id">
                        <span className="label">Ticket ID:</span>
                        <span className="value">{rsvp.ticket.id}</span>
                      </div>
                      {rsvp.ticket.qr_image && (
                        <div className="qr-code">
                          <img
                            src={rsvp.ticket.qr_image}
                            alt="Ticket QR Code"
                            className="img-fluid"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Share Section */}
              <div className="share-card">
                <h5 className="share-title">Share This Event</h5>
                <div className="share-buttons">
                  <button className="btn btn-outline-primary share-btn">
                    <i className="bi bi-facebook me-2"></i>
                    Facebook
                  </button>
                  <button className="btn btn-outline-info share-btn">
                    <i className="bi bi-twitter me-2"></i>
                    Twitter
                  </button>
                  <button className="btn btn-outline-success share-btn">
                    <i className="bi bi-whatsapp me-2"></i>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


