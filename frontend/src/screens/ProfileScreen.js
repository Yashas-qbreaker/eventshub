import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "../actions/userActions";
import Loader from "../components/Loader";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { loading, error, profile, updated } = useSelector((s) => s.userProfile);
  const [form, setForm] = useState({ first_name: "", last_name: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarRef = useRef(null);

  useEffect(() => { dispatch(getProfile()); }, [dispatch]);
  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || ""
      });
      setAvatarPreview(profile.avatar);
    }
  }, [profile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("first_name", form.first_name);
    fd.append("last_name", form.last_name);
    if (avatar) fd.append("avatar", avatar);
    dispatch(updateProfile(fd));
  };

  return (
    <div className="profile-screen">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="profile-card">
              <div className="profile-header">
                <div className="text-center mb-4">
                  <div className="profile-avatar-container">
                    <img
                      src={avatarPreview || "/avatar-placeholder.png"}
                      alt="Profile Avatar"
                      className="profile-avatar"
                    />
                    <button
                      type="button"
                      className="avatar-edit-btn"
                      onClick={() => avatarRef.current?.click()}
                    >
                      <i className="bi bi-camera-fill"></i>
                    </button>
                  </div>
                  <h2 className="profile-name mt-3">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <p className="profile-email text-muted">{profile?.email}</p>
                  <p className="profile-role badge bg-primary">{profile?.role}</p>
                </div>
              </div>

              <div className="profile-content">
                {error && (
                  <div className="alert alert-danger alert-enhanced mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {String(error)}
                  </div>
                )}
                {updated && (
                  <div className="alert alert-success alert-enhanced mb-4">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Profile updated successfully!
                  </div>
                )}

                <form onSubmit={submit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="form-group-enhanced">
                        <label className="form-label-enhanced">
                          <i className="bi bi-person me-2"></i>
                          First Name
                        </label>
                        <input
                          className="form-control-enhanced"
                          type="text"
                          value={form.first_name}
                          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                          placeholder="Enter your first name"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-enhanced">
                        <label className="form-label-enhanced">
                          <i className="bi bi-person me-2"></i>
                          Last Name
                        </label>
                        <input
                          className="form-control-enhanced"
                          type="text"
                          value={form.last_name}
                          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group-enhanced">
                    <label className="form-label-enhanced">
                      <i className="bi bi-image me-2"></i>
                      Profile Picture
                    </label>
                    <div className="file-input-wrapper">
                      <input
                        ref={avatarRef}
                        type="file"
                        accept="image/*"
                        className="file-input"
                        onChange={handleAvatarChange}
                        id="avatar-input"
                      />
                      <label htmlFor="avatar-input" className="file-input-label">
                        <i className="bi bi-cloud-upload me-2"></i>
                        {avatar ? avatar.name : 'Choose new avatar image'}
                      </label>
                    </div>
                    <div className="form-help">
                      Upload a new profile picture. Max size: 5MB. Supported formats: JPG, PNG, GIF
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary btn-save"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


