import React from 'react';
import { usePathname } from 'next/navigation';
import { Typography } from '@mui/material';

const currentPages = [
  { label: 'Home', path: '/events' },
  { label: 'Sign Up', path: '/signup' },
  { label: 'My Events', path: '/user/my-events' },
  { label: 'History', path: '/history' },
  { label: 'My Profile', path: '/user' },
  { label: 'Created Events', path: '/organizer-events' },
  { label: 'New Event', path: '/events/new' },
];

export default function PageTitle() {
  const pathname = usePathname();
  const currentPage = currentPages.find((p) => p.path === pathname);
  return (
    <>
      {currentPage ? (
        <Typography variant='h2' sx={{ color: '#070F3D' }}>
          {currentPage.label}
        </Typography>
      ) : (
        <></>
      )}
    </>
  );
}
