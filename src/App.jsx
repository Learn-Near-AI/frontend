import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Toaster } from 'sonner';
import Nav from './components/Nav';
import { AppRoutes } from './routes';
import { redirectToSuccessIfNeeded } from './lib/transactionHashes';
import { StreakProvider } from './context/StreakContext';

function AppContent({ mobileMenuOpen, setMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavigate = (path) => {
    if (path === currentPath) return;
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const scrollToTop = () => {
    if (currentPath !== '/') {
      handleNavigate('/');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const launchExamplesBrowser = () => {
    handleNavigate('/examples');
  };

  return (
    <div className="min-h-screen bg-[#111216]">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111216',
            border: '1px solid #3e3e42',
            color: '#fff',
          },
          className: 'sonner-toast',
        }}
        theme="dark"
      />
      {/* Navbar */}
      <Nav
        isDark={isDark}
        toggleTheme={toggleTheme}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToTop={scrollToTop}
        launchExamplesBrowser={launchExamplesBrowser}
        currentPath={currentPath}
        navigate={handleNavigate}
      />

      <AppRoutes
        isDark={isDark}
        toggleTheme={toggleTheme}
        scrollToTop={scrollToTop}
        launchExamplesBrowser={launchExamplesBrowser}
      />
    </div>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    redirectToSuccessIfNeeded();
  }, []);

  return (
    <BrowserRouter>
      <StreakProvider>
        <AppContent mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      </StreakProvider>
    </BrowserRouter>
  );
}

export default App;
