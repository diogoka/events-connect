'use client';
import React from 'react';
import { keyframes } from '@emotion/react';
import { Box, styled } from '@mui/system';

type Props = {
  color?: string;
};

const ThreeDots = ({ color }: Props) => {
  const setColor = color ? color : 'black';
  const rgb = color ? 'rgba(78, 78, 78, 0.5)' : 'rgba(78, 78, 78, 0.2)';

  const dotFlashing = keyframes`
  0% {
    background-color: ${setColor};
  }
  50%, 100% {
    background-color: ${rgb}
  }
`;

  const Dot = styled('div')({
    position: 'relative',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: `${setColor}`,
    animation: `${dotFlashing} 1s infinite linear alternate`,
    animationDelay: '0.5s',
    '&::before, &::after': {
      content: '""',
      display: 'inline-block',
      position: 'absolute',
      top: 0,
    },
    '&::before': {
      left: -15,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: `${setColor}`,
      animation: `${dotFlashing} 1s infinite alternate`,
      animationDelay: '0s',
    },
    '&::after': {
      left: 15,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: `${setColor}`,
      animation: `${dotFlashing} 1s infinite alternate`,
      animationDelay: '1s',
    },
  });

  return (
    <Box
      sx={{
        width: '46px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Dot />
    </Box>
  );
};

export default ThreeDots;
