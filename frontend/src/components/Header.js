import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.userProfile || {});
  const [userInfo, setUserInfo] = useState(() => {
    return localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
  });

  // Update userInfo when profile is updated or localStorage changes
  useEffect(() => {
    const updateUserInfo = () => {
      const storedUserInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
      if (storedUserInfo) {
        setUserInfo(storedUserInfo);
      }
    };

    // Initial load
    updateUserInfo();

    // Listen for storage events (when localStorage is updated from other tabs/windows)
    window.addEventListener('storage', updateUserInfo);
    
    // Listen for custom event (when localStorage is updated in same tab)
    window.addEventListener('localStorageUpdated', updateUserInfo);

    // Also check when profile is updated
    if (profile?.avatar) {
      updateUserInfo();
    }

    return () => {
      window.removeEventListener('storage', updateUserInfo);
      window.removeEventListener('localStorageUpdated', updateUserInfo);
    };
  }, [profile]);

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg py-3 bg-white shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center text-decoration-none" to="/">
          <div className="logo-container me-3">
            <span className="logo">EH</span>
          </div>
          <div className="brand-text">
            <span className="brand-main">EventHub</span>
            <span className="brand-tagline">Discover & Connect</span>
          </div>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <div className="d-flex align-items-center gap-3 ms-auto">
            {userInfo ? (
              <>
                {/* Home button */}
                <Link to="/" className="nav-link home-btn d-flex align-items-center px-3 py-2 rounded-pill text-decoration-none">
                  <i className="bi bi-house-door me-2"></i>
                  <span className="d-none d-md-inline">Home</span>
                </Link>

                {/* Create event - only for admins */}
                {userInfo?.is_staff && (
                <NavLink to="/organizer/create" className="nav-link create-event-btn d-flex align-items-center px-3 py-2 rounded-pill">
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  <span className="d-none d-md-inline">Create Event</span>
                  <span className="d-md-none">Create</span>
                </NavLink>
                )}

                <div className="nav-actions d-flex gap-2">
                  <NavLink to="/likes" className="nav-icon-btn" title="Liked Events">
                    <i className="bi bi-heart"></i>
                  </NavLink>

                  <NavLink to="/bookings" className="nav-icon-btn" title="My Bookings">
                    <i className="bi bi-ticket-perforated"></i>
                  </NavLink>
                </div>

                <div className="dropdown">
                  <button
                    className="user-profile-btn d-flex align-items-center gap-2 border-0 bg-transparent p-1 rounded-pill"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    id="userProfileDropdown"
                  >
                    <div className="avatar-container">
                      <img
                        key={`avatar-${userInfo?.avatar || 'no-avatar'}-${userInfo?.id || 'no-id'}`}
                        src={(() => {
                          if (!userInfo?.avatar) return "/avatar-placeholder.png";
                          if (userInfo.avatar.startsWith('http')) return userInfo.avatar;
                          return `${process.env.REACT_APP_API_BASE || "http://localhost:8000"}${userInfo.avatar}`;
                        })()}
                        alt="Profile"
                        className="rounded-circle avatar-img"
                        width="36"
                        height="36"
                        loading="eager"
                        onError={(e) => {
                          const placeholder = "/avatar-placeholder.png";
                          if (e.target.src !== placeholder && !e.target.src.includes('avatar-placeholder')) {
                            e.target.src = placeholder;
                            e.target.onerror = null; // Prevent infinite loop
                          }
                        }}
                      />
                      <div className="avatar-status"></div>
                    </div>
                    <div className="user-info d-none d-lg-block">
                      <div className="user-name fw-semibold text-dark">{userInfo?.first_name || userInfo?.username}</div>
                      <div className="user-email small text-muted">{userInfo?.email}</div>
                    </div>
                    <i className="bi bi-chevron-down text-muted ms-1 small"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end mt-3 shadow-lg border-0" style={{ borderRadius: '12px', minWidth: '220px' }} aria-labelledby="userProfileDropdown">
                    <li className="dropdown-header px-3 py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '12px 12px 0 0' }}>
                      <div className="fw-semibold">{userInfo?.first_name || userInfo?.username}</div>
                      <div className="small opacity-75">{userInfo?.email}</div>
                      <div className="badge bg-white bg-opacity-25 mt-1">{userInfo?.role}</div>
                    </li>
                    <li><hr className="dropdown-divider my-2" /></li>
                    <li><Link className="dropdown-item d-flex align-items-center py-2 px-3" to="/" style={{ borderRadius: '8px', margin: '2px 4px' }}>
                      <i className="bi bi-house-door me-3"></i>Browse Events
                    </Link></li>
                    <li><Link className="dropdown-item d-flex align-items-center py-2 px-3" to="/bookings" style={{ borderRadius: '8px', margin: '2px 4px' }}>
                      <i className="bi bi-ticket-perforated me-3"></i>My Tickets
                    </Link></li>
                    <li><Link className="dropdown-item d-flex align-items-center py-2 px-3" to="/likes" style={{ borderRadius: '8px', margin: '2px 4px' }}>
                      <i className="bi bi-heart me-3"></i>My Watchlist
                    </Link></li>
                    <li><Link className="dropdown-item d-flex align-items-center py-2 px-3" to="/organizer/events" style={{ borderRadius: '8px', margin: '2px 4px' }}>
                      <i className="bi bi-calendar-event me-3"></i>My Events
                    </Link></li>
                    <li><hr className="dropdown-divider my-2" /></li>
                    <li><Link className="dropdown-item d-flex align-items-center py-2 px-3" to="/profile" style={{ borderRadius: '8px', margin: '2px 4px' }}>
                      <i className="bi bi-gear me-3"></i>Account Settings
                    </Link></li>
                    <li><button className="dropdown-item d-flex align-items-center text-danger py-2 px-3" onClick={logout} style={{ borderRadius: '8px', margin: '2px 4px' }}>
                      <i className="bi bi-box-arrow-right me-3"></i>Log Out
                    </button></li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="auth-buttons d-flex gap-2">
                <button onClick={() => navigate("/login")} className="btn btn-outline-primary px-4 py-2 rounded-pill">
                  <i className="bi bi-box-arrow-in-right me-2 d-none d-md-inline"></i>
                  Log In
                </button>
                <button onClick={() => navigate("/register")} className="btn btn-primary px-4 py-2 rounded-pill">
                  <i className="bi bi-person-plus me-2 d-none d-md-inline"></i>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


