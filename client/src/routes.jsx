import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './views/Login';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import UserSettings from './views/UserSettings';
import AccountManagement from './views/AccountManagement';
import LoggedOut from './views/LoggedOut';
import ForgotPassword from './views/ForgotPassword';
import NoMatch from './views/NoMatch';
import { api } from './api';

function PrivateRoute({ authed, children }) {
  const location = useLocation();
  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function PublicRoute({ authed, children }) {
  const location = useLocation();
  if (authed) {
    const dest = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={dest} replace />;
  }
  return children;
}

function needsMfaEnroll(user) {
  return Boolean(
    user && !user.mfaEnabled && sessionStorage.getItem('mfaEnrollmentRequired') === '1',
  );
}

const OFFICER_PATHS = ['/dashboard', '/tip/', '/settings', '/account_management', '/logout'];

function AppShell({ children }) {
  const location = useLocation();
  const isOfficer = OFFICER_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(p),
  );
  return (
    <div className={isOfficer ? 'app-shell app-shell--officer' : 'app-shell'}>
      {children}
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        const { user: me } = await api.me();
        if (!cancelled) {
          setUser(me);
          setAuthed(true);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setAuthed(false);
        }
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const onLogin = (nextUser, opts = {}) => {
    setUser(nextUser);
    setAuthed(true);
    if (opts.mfaEnrollmentRequired) {
      sessionStorage.setItem('mfaEnrollmentRequired', '1');
    } else {
      sessionStorage.removeItem('mfaEnrollmentRequired');
    }
  };

  const onLogout = async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    setUser(null);
    setAuthed(false);
  };

  if (authed === null) {
    return <div className="loading-screen">Loading…</div>;
  }

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/suspect" element={<Home />} />
          <Route path="/vehicle" element={<Home />} />
          <Route path="/drugs" element={<Home />} />
          <Route path="/media" element={<Home />} />
          <Route path="/final" element={<Home />} />
          <Route path="/success" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/faq" element={<Home />} />
          <Route
            path="/login"
            element={(
              <PublicRoute authed={authed}>
                <Login onLogin={onLogin} />
              </PublicRoute>
            )}
          />
          <Route
            path="/forgot_password"
            element={(
              <PublicRoute authed={authed}>
                <ForgotPassword />
              </PublicRoute>
            )}
          />
          <Route
            path="/dashboard"
            element={(
              <PrivateRoute authed={authed}>
                {needsMfaEnroll(user) ? (
                  <Navigate to="/settings" replace />
                ) : (
                  <Dashboard user={user} onLogout={onLogout} />
                )}
              </PrivateRoute>
            )}
          />
          <Route
            path="/tip/:tipId"
            element={(
              <PrivateRoute authed={authed}>
                {needsMfaEnroll(user) ? (
                  <Navigate to="/settings" replace />
                ) : (
                  <Dashboard user={user} onLogout={onLogout} />
                )}
              </PrivateRoute>
            )}
          />
          <Route
            path="/settings"
            element={(
              <PrivateRoute authed={authed}>
                <UserSettings user={user} onLogout={onLogout} setUser={setUser} />
              </PrivateRoute>
            )}
          />
          <Route
            path="/account_management"
            element={(
              <PrivateRoute authed={authed}>
                {needsMfaEnroll(user) ? (
                  <Navigate to="/settings" replace />
                ) : (
                  <AccountManagement user={user} onLogout={onLogout} />
                )}
              </PrivateRoute>
            )}
          />
          <Route
            path="/logout"
            element={(
              <PrivateRoute authed={authed}>
                <LoggedOut onLogout={onLogout} />
              </PrivateRoute>
            )}
          />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
