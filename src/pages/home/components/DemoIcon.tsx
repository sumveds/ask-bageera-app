import { Button } from '@mui/material';
import React from 'react';
import DemoSvg from '../../../assets/icons/demo.svg';
import { ButtonStyle } from '../styles/ButtonStyle';

import '../styles/Home.css';

export default function DemoIcon(props: { onChange: () => void }) {

  const { onChange } = props;

  return (
    <div>
      <div className='Icons-Svg'>
        <Button component='label' style={ButtonStyle.STYLE} variant="contained">
          <img src={DemoSvg}
            width={80} height={80}
            onClick={onChange} />
        </Button>
      </div>
      <div className='Icons-Label'>
        Try Sample Data
      </div>
    </div>
  );
}
