import React from 'react';
import { Button } from '@mui/material';

import BigQuerySvg from '../../../assets/icons/google-bigquery.svg';
import { ButtonStyle } from '../styles/ButtonStyle';

import '../styles/Connectors.css';

export default function BigQueryIcon(props: { onClick: () => void }) {

  const { onClick } = props;

  return (
    <div>
      <div className='Icons-Svg'>
        <Button component='label' style={ButtonStyle.STYLE} variant="contained">
          <img src={BigQuerySvg}
            width={80} height={80}
            onClick={onClick} />
        </Button>
      </div>
      <div className='Icons-Label'>
        Google BigQuery
      </div>
    </div>
  );
}
