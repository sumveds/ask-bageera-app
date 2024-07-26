import React from 'react';

import { keyframes } from '@emotion/react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { red } from '@mui/material/colors';

const blink = keyframes`
  0% {
    opacity: .2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: .2;
  }
`;

const LoadingDots: React.FC = () => {
  const theme = useTheme();

  const StyledDots = styled('div')({
    '& div': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: '50%',
      width: 6,
      height: 6,
      margin: '0 2px',
      animation: `${blink} 1.4s infinite both`,
    },
    '& div:nth-of-type(2)': {
      animationDelay: '0.2s',
    },
    '& div:nth-of-type(3)': {
      animationDelay: '0.4s',
    },
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'end',
    width: '100%',
  });

  const Label = styled('span')({
    color: red[500],
    marginRight: theme.spacing(1),
  });

  return (
    <StyledDots>
      <Label>Bageera:</Label>
      <div />
      <div />
      <div />
    </StyledDots>
  );
}

export default LoadingDots;
