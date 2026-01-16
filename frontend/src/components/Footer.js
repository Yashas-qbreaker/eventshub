import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto py-4">
      <div className="container text-center text-muted">© {new Date().getFullYear()} EventHub</div>
    </footer>
  );
}


