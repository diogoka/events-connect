import React, { cloneElement } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

type Props = {
  src?: any;
  value: string;
  type?: 'TITLE' | 'SUBTITLE';
  size?: 'LARGE' | 'SMALL';
};

export default function UserInfoItem({
  src,
  value,
  type = 'SUBTITLE',
  size = 'SMALL',
}: Props) {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' gap='8px'>
      {src && (
        <Image
          src={src}
          alt='icon'
          width={size === 'LARGE' ? 28 : 24}
          height={size === 'LARGE' ? 28 : 24}
          style={{ fontWeight: 700 }}
        />
      )}
      <Typography
        sx={{
          fontSize: type === 'TITLE' ? '24px' : '16px',
          fontWeight: type === 'TITLE' ? 500 : 400,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
