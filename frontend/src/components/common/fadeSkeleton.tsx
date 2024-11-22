import React from 'react';
import { Skeleton, Fade } from '@mui/material';

interface FadeSkeletonProps {
  variant: 'text' | 'rectangular' | 'circular';
  width: number | string;
  height: number | string;
  animation?: 'pulse' | 'wave' | false;
  style?: React.CSSProperties;
  delay?: number;
}

const FadeSkeleton: React.FC<FadeSkeletonProps> = ({
  variant,
  width,
  height,
  animation = 'wave',
  style = {},
  delay = 800,
}) => {
  return (
    <Fade in timeout={delay} easing={'ease-in-out'}>
      <Skeleton
        variant={variant}
        width={width}
        height={height}
        animation={animation}
        style={{ ...style, borderRadius: '8px' }}
      />
    </Fade>
  );
};

export default FadeSkeleton;
