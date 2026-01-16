import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import EventDetailScreen from "./screens/EventDetailScreen";
import CreateEventScreen from "./screens/CreateEventScreen";
import OrganizerEventsScreen from "./screens/OrganizerEventsScreen";
import QrVerifyScreen from "./screens/QrVerifyScreen";
import MyBookingsScreen from "./screens/MyBookingsScreen";
import LikesScreen from "./screens/LikesScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="d-flex flex-column min-vh-100">
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? "flex-fill" : "app-main my-4 flex-fill"}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          
          {/* Update create event route */}
          <Route path="/organizer/create" element={
            <ProtectedRoute>
              <CreateEventScreen />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          } />
          <Route path="/likes" element={
            <ProtectedRoute>
              <LikesScreen />
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <MyBookingsScreen />
            </ProtectedRoute>
          } />

          {/* Organizer-specific routes */}
          <Route path="/organizer/events" element={
            <ProtectedRoute>
              <OrganizerEventsScreen />
            </ProtectedRoute>
          } />
          <Route path="/organizer/verify" element={
            <ProtectedRoute>
              <QrVerifyScreen />
            </ProtectedRoute>
          } />

          <Route path="/event/:id" element={<EventDetailScreen />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}


