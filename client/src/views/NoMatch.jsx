import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Panel } from '../components/ui';

const NoMatch = () => (
  <Layout>
    <Panel title="Page not found" meta="404">
      <p>Sorry, but the page you are looking for has not been found.</p>
      <p>
        <Link to="/">Return to tip form</Link>
      </p>
    </Panel>
  </Layout>
);

export default NoMatch;
