import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listMyLikes } from "../actions/eventActions";
import Loader from "../components/Loader";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";

export default function LikesScreen() {
  const dispatch = useDispatch();
  const { loading, error, events } = useSelector((s) => s.eventList);

  useEffect(() => {
    dispatch(listMyLikes());
  }, [dispatch]);

  return (
    <div className="likes-screen">
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="mb-4">
            <i className="bi bi-heart-fill" style={{ fontSize: '3rem', color: '#e53e3e' }}></i>
          </div>
          <h1 className="display-5 fw-bold mb-3">My Watchlist</h1>
          <p className="lead text-muted">Your favorite events, all in one place</p>
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
        ) : events && events.length > 0 ? (
          <>
            <div className="events-grid">
              {events.map((like) => (
                <EventCard event={like.event} key={like.id} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-heart" style={{ fontSize: '4rem', color: '#cbd5e0' }}></i>
            </div>
            <h3 className="text-muted mb-3">No events in your watchlist yet</h3>
            <p className="text-muted mb-4">
              Start exploring events and add them to your watchlist by clicking the heart icon!
            </p>
            <Link to="/" className="btn btn-primary btn-lg px-4">
              <i className="bi bi-search me-2"></i>
              Discover Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
