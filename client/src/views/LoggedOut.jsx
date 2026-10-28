import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Panel } from '../components/ui';

export default function LoggedOut({ onLogout }) {
  useEffect(() => {
    if (onLogout) onLogout();
  }, [onLogout]);

  return (
    <Layout>
      <div className="auth-panel">
        <Panel title="Signed out">
          <p>
            Click <Link to="/login">here</Link> to sign in again.
          </p>
        </Panel>
      </div>
    </Layout>
  );
}

LoggedOut.propTypes = {
  onLogout: PropTypes.func,
};

LoggedOut.defaultProps = {
  onLogout: null,
};
