import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import Layout from '../components/Layout';

const LoggedOut = () => (
  <Layout>
    <Card>
      <Card.Content header="Signed out" />
      <Card.Content>
        <div>Click
          <Link to="login">here</Link>to login again.</div>
      </Card.Content>
    </Card>
  </Layout>
);

export default LoggedOut;
