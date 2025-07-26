import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import JoinTeam from "./pages/JoinTeam";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";

function App() {
  return (
    <HelmetProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/join" element={<Navigate to="/join-team" replace />} />
          <Route path="/join-team" element={<JoinTeam />} />
        </Routes>
      </MainLayout>
    </HelmetProvider>
  );
}

export default App;
