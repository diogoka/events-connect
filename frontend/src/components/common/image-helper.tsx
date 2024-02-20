'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';

const FALLBACK_IMAGE = '/event_placeholder.png';

// This is an image component that displays fallback image if the link doesn't exist
export default function ImageHelper(props: any) {
  const { src, alt, width, height, style, ...rest } = props;

  const [isImageFound, setIsImageFound] = useState(true);

  useEffect(() => {
    setIsImageFound(true);
  }, [src]);

  return (
    <Image
      {...rest}
      src={isImageFound ? src : FALLBACK_IMAGE}
      alt={alt}
      loader={() => (isImageFound ? src : FALLBACK_IMAGE)}
      onError={() => {
        setIsImageFound(false);
      }}
      width={0}
      height={0}
      style={{
        ...style,
        width: width,
        height: height,
        overflow: 'hidden',
        objectFit: 'cover',
        border: isImageFound ? 'none' : '1px solid #EEEEEE',
        borderRadius: style?.borderRadius ?? 0,
      }}
      unoptimized
      priority
    />
  );
}
