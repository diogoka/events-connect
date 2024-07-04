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
            width: '111.59px',
          }}
          disableRipple
          disableTouchRipple
        >
          <Image
            src='/justLogoBlue.svg'
            alt='cornerstone-connect logo'
            width={445}
            height={445}
            priority={true}
            style={{ width: '38%', height: 'auto' }}
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
