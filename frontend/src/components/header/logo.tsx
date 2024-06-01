import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import Switcher from '../common/switcher';
import Image from 'next/image';

export default function Logo() {
  const router = useRouter();
  return (
    <Switcher
      sp={
        <Button
          onClick={() => router.push('/')}
          sx={{
            '&:hover': { background: 'none' },
          }}
          disableRipple
          disableTouchRipple
        >
          {/* height * 3.72 (w/h) = weight */}
          <Image
            src='/cornestone-connect-logo-blue-wide.png'
            alt='cornerstone-connect logo'
            width={111.6}
            height={30}
            priority={true}
          />
        </Button>
      }
      pc={
        <Button
          onClick={() => router.push('/')}
          sx={{
            minWidth: '223.20px',
            '&:hover': { background: 'none' },
          }}
          disableRipple
          disableTouchRipple
        >
          <Image
            src='/cornestone-connect-logo-blue-wide.png'
            alt='cornerstone-connect logo'
            width={223.2}
            height={60}
            priority={true}
            style={{ minWidth: '223.20px' }}
          />
        </Button>
      }
    />
  );
}
