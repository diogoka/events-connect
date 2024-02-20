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
            minWidth: 0,

            width: 'auto',
            height: 'auto',
            '&:hover': { background: 'none' },
          }}
          disableRipple
          disableTouchRipple
        >
          <Image
            src='/eventllege_Icon.svg'
            alt='eventllege logo'
            width={40}
            height={40}
            priority={true}
          />
        </Button>
      }
      pc={
        <Button
          onClick={() => router.push('/')}
          sx={{
            width: '10rem',
            height: '1.875rem',
            '&:hover': { background: 'none' },
          }}
          disableRipple
          disableTouchRipple
        >
          <Image
            src='/eventllege_logoIcon.svg'
            alt='eventllege logo'
            width={152}
            height={30}
            priority={true}
          />
        </Button>
      }
    />
  );
}
