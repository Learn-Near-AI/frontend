import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExamplesBrowser from '../components/ExamplesBrowser';
import { LandingPage } from '../features/landing';
import Roadmap from '../components/Roadmap';
import Footer from '../components/Footer';
import AgentPage from '../components/AgentPage';

/**
 * Application route definitions.
 * Centralizes all route configuration for maintainability.
 */
export function AppRoutes({ isDark, toggleTheme, scrollToTop, launchExamplesBrowser }) {
  return (
    <Routes>
      <Route path="/roadmap" element={<Roadmap scrollToTop={scrollToTop} />} />
      <Route path="/agent" element={<AgentPage />} />
      <Route
        path="/examples/*"
        element={<ExamplesBrowser isDark={isDark} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/"
        element={
          <>
            <LandingPage launchExamplesBrowser={launchExamplesBrowser} />
            <Footer scrollToTop={scrollToTop} />
          </>
        }
      />
    </Routes>
  );
}
