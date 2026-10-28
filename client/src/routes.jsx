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

  const onLogin = (nextUser) => {
    setUser(nextUser);
    setAuthed(true);
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
    return <div style={{ padding: 40, color: '#fff' }}>Loading…</div>;
  }

  const style = {
    background: '#2196F3',
    margin: '0px',
    boxSizing: 'border-box',
    minHeight: '100vh',
    borderBottom: 'solid 20px #1976d2',
  };

  return (
    <BrowserRouter>
      <div style={style}>
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
                <Dashboard user={user} onLogout={onLogout} />
              </PrivateRoute>
            )}
          />
          <Route
            path="/tip/:tipId"
            element={(
              <PrivateRoute authed={authed}>
                <Dashboard user={user} onLogout={onLogout} />
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
                <AccountManagement user={user} onLogout={onLogout} />
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
      </div>
    </BrowserRouter>
  );
}
