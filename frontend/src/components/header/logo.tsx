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
            width: '30%',
          }}
          disableRipple
          disableTouchRipple
        >
          <Image
            src='/cornestone-connect-logo-blue-wide.png'
            alt='cornerstone-connect logo'
            width={744}
            height={153}
            priority={true}
            style={{ width: '100%', height: 'auto' }}
          />
        </Button>
      }
      pc={
        <Button
          onClick={() => router.push('/')}
          sx={{
            minWidth: '223.20px',
            '&:hover': { background: 'none' },
            justifyContent: 'flex-start',
          }}
          disableRipple
          disableTouchRipple
        >
          <Image
            src='/cornestone-connect-logo-blue-wide.png'
            alt='cornerstone-connect logo'
            width={744}
            height={153}
            priority={true}
            style={{ minWidth: '223.20px', width: '15%', height: 'auto' }}
          />
        </Button>
      }
    />
  );
}
