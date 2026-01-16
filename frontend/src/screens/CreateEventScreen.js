import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../actions/eventActions";

export default function CreateEventScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((s) => s.eventCreate || {});

  const [form, setForm] = useState({ title: "", description: "", start_datetime: "", location: "", capacity: 0, featured: false, category: "" });
  const [poster, setPoster] = useState(null);
  const [images, setImages] = useState([]);
  const posterRef = useRef(null);
  const imagesRef = useRef(null);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const resetAll = () => {
    setForm({ title: "", description: "", start_datetime: "", location: "", capacity: 0, featured: false, category: "" });
    setPoster(null);
    setImages([]);
    if (posterRef.current) posterRef.current.value = "";
    if (imagesRef.current) imagesRef.current.value = "";
  };

  useEffect(() => {
    if (success) {
      resetAll();
      navigate("/organizer/events");
    }
  }, [success, navigate]);

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (poster) fd.append("poster", poster);
    if (images && images.length) {
      Array.from(images).forEach((file) => fd.append("images", file));
    }
    dispatch(createEvent(fd));
  };

  return (
    <div className="create-event-screen">
      <div className="container-fluid px-4 py-5">
        {/* Header Section */}
        <div className="create-event-header">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h1 className="create-event-title">Create New Event</h1>
              <p className="create-event-subtitle">Share your event with the community and reach more attendees</p>
            </div>
            <button className="btn btn-outline-secondary back-btn" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="alert alert-danger alert-enhanced mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {String(error)}
          </div>
        )}
        {success && (
          <div className="alert alert-success alert-enhanced mb-4">
            <i className="bi bi-check-circle-fill me-2"></i>
            Event created successfully — redirecting...
          </div>
        )}

        <div className="row g-5">
          {/* Form Section */}
          <div className="col-lg-7">
            <div className="create-event-form-card">
              <div className="form-header">
                <h3 className="form-title">
                  <i className="bi bi-calendar-plus me-3"></i>
                  Event Details
                </h3>
                <p className="form-subtitle">Fill in the information about your event</p>
              </div>

              <form onSubmit={submit} onReset={resetAll} className="create-event-form">
                {/* Title Field */}
                <div className="form-group-enhanced">
                  <label className="form-label-enhanced">
                    <i className="bi bi-type me-2"></i>
                    Event Title *
                  </label>
                  <input
                    name="title"
                    type="text"
                    className="form-control-enhanced"
                    placeholder="Enter an engaging title for your event"
                    value={form.title}
                    onChange={change}
                    required
                  />
                </div>

                {/* Description Field */}
                <div className="form-group-enhanced">
                  <label className="form-label-enhanced">
                    <i className="bi bi-textarea-resize me-2"></i>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    className="form-control-enhanced"
                    rows="6"
                    placeholder="Describe your event, what attendees can expect, and any important details..."
                    value={form.description}
                    onChange={change}
                    required
                  />
                  <div className="form-help">
                    Provide a detailed description to help attendees understand what your event is about.
                  </div>
                </div>

                {/* Date & Location Row */}
                <div className="form-row-enhanced">
                  <div className="form-group-enhanced">
                    <label className="form-label-enhanced">
                      <i className="bi bi-calendar-event me-2"></i>
                      Date & Time *
                    </label>
                    <input
                      name="start_datetime"
                      type="datetime-local"
                      className="form-control-enhanced"
                      value={form.start_datetime}
                      onChange={change}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                  </div>

                  <div className="form-group-enhanced">
                    <label className="form-label-enhanced">
                      <i className="bi bi-geo-alt me-2"></i>
                      Location *
                    </label>
                    <input
                      name="location"
                      type="text"
                      className="form-control-enhanced"
                      placeholder="Venue name or address"
                      value={form.location}
                      onChange={change}
                      required
                    />
                  </div>
                </div>

                {/* Category Field */}
                <div className="form-group-enhanced">
                  <label className="form-label-enhanced">
                    <i className="bi bi-tag me-2"></i>
                    Category
                  </label>
                  <select
                    name="category"
                    className="form-control-enhanced"
                    value={form.category}
                    onChange={change}
                  >
                    <option value="">Select a category</option>
                    <option value="Music">Music</option>
                    <option value="Nightlife">Nightlife</option>
                    <option value="Performing & Visual">Performing & Visual</option>
                    <option value="Business">Business</option>
                    <option value="Food & Drink">Food & Drink</option>
                    <option value="Hobbies">Hobbies</option>
                    <option value="Dating">Dating</option>
                    <option value="Halloween">Halloween</option>
                  </select>
                  <div className="form-help">
                    Choose a category to help attendees find your event
                  </div>
                </div>

                {/* Capacity & Poster Row */}
                <div className="form-row-enhanced">
                  <div className="form-group-enhanced">
                    <label className="form-label-enhanced">
                      <i className="bi bi-people me-2"></i>
                      Capacity
                    </label>
                    <input
                      name="capacity"
                      type="number"
                      min="1"
                      className="form-control-enhanced"
                      placeholder="Maximum attendees"
                      value={form.capacity || ''}
                      onChange={change}
                    />
                    <div className="form-help">
                      Leave empty for unlimited capacity
                    </div>
                  </div>

                  <div className="form-group-enhanced">
                    <label className="form-label-enhanced">
                      <i className="bi bi-image me-2"></i>
                      Event Poster
                    </label>
                    <div className="file-input-wrapper">
                      <input
                        ref={posterRef}
                        type="file"
                        accept="image/*"
                        className="file-input"
                        onChange={(e) => setPoster(e.target.files[0])}
                        id="poster-input"
                      />
                      <label htmlFor="poster-input" className="file-input-label">
                        <i className="bi bi-cloud-upload me-2"></i>
                        {poster ? poster.name : 'Choose poster image'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="form-group-enhanced">
                  <div className="featured-toggle">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      className="featured-checkbox"
                      checked={form.featured}
                      onChange={change}
                    />
                    <label htmlFor="featured" className="featured-label">
                      <div className="featured-content">
                        <div className="featured-icon">
                          <i className="bi bi-star-fill"></i>
                        </div>
                        <div className="featured-text">
                          <div className="featured-title">Featured Event</div>
                          <div className="featured-description">Highlight your event to reach more attendees</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="form-group-enhanced">
                  <label className="form-label-enhanced">
                    <i className="bi bi-images me-2"></i>
                    Gallery Images
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      ref={imagesRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="file-input"
                      onChange={(e) => setImages(e.target.files)}
                      id="gallery-input"
                    />
                    <label htmlFor="gallery-input" className="file-input-label">
                      <i className="bi bi-images me-2"></i>
                      {images && images.length > 0 ? `${images.length} image${images.length > 1 ? 's' : ''} selected` : 'Choose gallery images'}
                    </label>
                  </div>

                  {images && images.length > 0 && (
                    <div className="image-preview-grid">
                      {Array.from(images).map((file, idx) => (
                        <div key={idx} className="image-preview-item">
                          <img src={URL.createObjectURL(file)} alt={file.name} />
                          <button
                            type="button"
                            className="image-remove-btn"
                            onClick={() => {
                              const newImages = Array.from(images).filter((_, i) => i !== idx);
                              setImages(newImages);
                              if (imagesRef.current) {
                                // Reset file input (limited browser support)
                                imagesRef.current.value = '';
                              }
                            }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary btn-create"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Creating Event...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Create Event
                      </>
                    )}
                  </button>
                  <button type="reset" className="btn btn-outline-secondary btn-reset">
                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="col-lg-5">
            <div className="create-event-preview">
              <div className="preview-header">
                <h3 className="preview-title">
                  <i className="bi bi-eye me-3"></i>
                  Live Preview
                </h3>
                <p className="preview-subtitle">See how your event will appear to attendees</p>
              </div>

              <div className="preview-card">
                <div className="preview-image-container">
                  {poster ? (
                    <img src={URL.createObjectURL(poster)} alt="Event poster" className="preview-image" />
                  ) : (
                    <div className="preview-image-placeholder">
                      <div className="placeholder-icon">
                        <i className="bi bi-image"></i>
                      </div>
                      <div className="placeholder-text">Event Poster</div>
                    </div>
                  )}
                  {form.featured && (
                    <div className="preview-badge-featured">
                      <i className="bi bi-star-fill me-1"></i>
                      Featured
                    </div>
                  )}
                </div>

                <div className="preview-content">
                  <div className="preview-header-content">
                    <h4 className="preview-event-title">{form.title || "Your Event Title"}</h4>
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
                    {form.description || "Your event description will appear here. Make it engaging and informative to attract more attendees."}
                  </p>

                  <div className="preview-meta">
                    <div className="meta-item">
                      <i className="bi bi-geo-alt-fill"></i>
                      <span>{form.location || "Event Location"}</span>
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-calendar-event-fill"></i>
                      <span>{form.start_datetime ? new Date(form.start_datetime).toLocaleDateString() : "Event Date"}</span>
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-clock-fill"></i>
                      <span>{form.start_datetime ? new Date(form.start_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Event Time"}</span>
                    </div>
                  </div>

                  <div className="preview-footer">
                    <div className="availability-info">
                      <div className="availability-text">
                        <span className="capacity-text">
                          {form.capacity ? `${form.capacity} seats available` : "Unlimited capacity"}
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-book-preview">
                      <i className="bi bi-ticket-perforated me-2"></i>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Gallery Preview */}
              {images && images.length > 0 && (
                <div className="gallery-preview">
                  <h5 className="gallery-title">
                    <i className="bi bi-images me-2"></i>
                    Gallery ({images.length})
                  </h5>
                  <div className="gallery-grid">
                    {Array.from(images).slice(0, 6).map((file, idx) => (
                      <div key={idx} className="gallery-item">
                        <img src={URL.createObjectURL(file)} alt={`Gallery ${idx + 1}`} />
                      </div>
                    ))}
                    {images.length > 6 && (
                      <div className="gallery-more">
                        +{images.length - 6} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


