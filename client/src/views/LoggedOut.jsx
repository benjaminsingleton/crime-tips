import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import Layout from '../components/Layout';

export default function LoggedOut({ onLogout }) {
  useEffect(() => {
    if (onLogout) onLogout();
  }, [onLogout]);

  return (
    <Layout>
      <Card>
        <Card.Content header="Signed out" />
        <Card.Content>
          <div>
            Click <Link to="/login">here</Link> to login again.
          </div>
        </Card.Content>
      </Card>
    </Layout>
  );
}

LoggedOut.propTypes = {
  onLogout: PropTypes.func,
};

LoggedOut.defaultProps = {
  onLogout: null,
};
