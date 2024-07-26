import React from 'react';
import { useLocation } from 'react-router-dom';

import Layout from '../../components/Layout';
import BigQueryDatasets from './components/BigQueryDatasets';

const BigQuery = () => {
  const { state } = useLocation();
  const { config } = state;

  console.log('BigQuery: State object:', config);

  return (
    <Layout>
      <div>
        <BigQueryDatasets config={config} />
      </div>
    </Layout>
  );
};

export default BigQuery;
