'use client';
import React from 'react';
import { keyframes } from '@emotion/react';
import { Box, styled } from '@mui/system';

const dotFlashing = keyframes`
  0% {
    background-color: black;
  }
  50%, 100% {
    background-color: rgba(78, 78, 78, 0.2);
  }
`;

const Dot = styled('div')({
  position: 'relative',
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: 'black',
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
    backgroundColor: 'black',
    animation: `${dotFlashing} 1s infinite alternate`,
    animationDelay: '0s',
  },
  '&::after': {
    left: 15,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
    animation: `${dotFlashing} 1s infinite alternate`,
    animationDelay: '1s',
  },
});

const ThreeDots = () => {
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
