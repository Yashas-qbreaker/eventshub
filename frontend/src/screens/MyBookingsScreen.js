import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listMyTickets } from "../actions/eventActions";
import Loader from "../components/Loader";

export default function MyBookingsScreen() {
  const dispatch = useDispatch();
  const { loading, error, tickets } = useSelector((s) => s.ticketList);

  useEffect(() => { dispatch(listMyTickets()); }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return '#10b981';
      case 'used': return '#6b7280';
      default: return '#6b7280';
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

  return (
    <div className="my-bookings-screen">
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="mb-4">
            <i className="bi bi-ticket-perforated-fill" style={{ fontSize: '3rem', color: '#4f46e5' }}></i>
          </div>
          <h1 className="display-5 fw-bold mb-3">My Tickets</h1>
          <p className="lead text-muted">Manage your event bookings and tickets</p>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Loader />
          </div>
        ) : error ? (
          <div className="d-flex justify-content-center">
            <div className="alert alert-danger text-center" style={{
              borderRadius: '15px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {String(error)}
            </div>
          </div>
        ) : tickets && tickets.length > 0 ? (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card-enhanced">
                <div className="ticket-header">
                  <div className="ticket-status" style={{ backgroundColor: getStatusColor(ticket.status) }}>
                    <i className={`bi ${ticket.status.toLowerCase() === 'active' ? 'bi-check-circle-fill' : 'bi-check-circle'}`}></i>
                    <span>{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
                  </div>
                  <div className="ticket-id">#{ticket.id.split('-')[0]}</div>
                </div>

                <div className="ticket-content">
                  <div className="event-info">
                    <h3 className="event-title">{ticket.event.title}</h3>
                    <div className="event-meta">
                      <div className="meta-item">
                        <i className="bi bi-calendar-event"></i>
                        <span>{formatDate(ticket.event.start_datetime)}</span>
                      </div>
                      <div className="meta-item">
                        <i className="bi bi-clock"></i>
                        <span>{formatTime(ticket.event.start_datetime)}</span>
                      </div>
                      <div className="meta-item">
                        <i className="bi bi-geo-alt"></i>
                        <span>{ticket.event.location}</span>
                      </div>
                    </div>
                  </div>

                  {ticket.qr_image && (
                    <div className="qr-section">
                      <div className="qr-code">
                        <img src={ticket.qr_image} alt="Ticket QR Code" />
                      </div>
                      <div className="qr-info">
                        <p className="qr-text">Scan this QR code at the event entrance</p>
                        {ticket.scanned_at && (
                          <p className="scanned-info">
                            <i className="bi bi-check-circle-fill text-success me-1"></i>
                            Scanned on {new Date(ticket.scanned_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ticket-footer">
                  <div className="ticket-actions">
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-download me-1"></i>
                      Download
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      <i className="bi bi-share me-1"></i>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-ticket-perforated" style={{ fontSize: '4rem', color: '#cbd5e0' }}></i>
            </div>
            <h3 className="text-muted mb-3">No tickets yet</h3>
            <p className="text-muted mb-4">
              You haven't booked any events yet. Start exploring and book your first event!
            </p>
            <a href="/" className="btn btn-primary btn-lg">
              <i className="bi bi-search me-2"></i>
              Browse Events
            </a>
          </div>
        )}
      </div>
    </div>
  );
}


