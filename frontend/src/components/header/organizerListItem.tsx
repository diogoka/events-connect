import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

type Props = {
  toggleMenu: (isMenuOpen: boolean) => void;
};

const OrganizerBtns = [
  { label: 'Created Events', path: '/organizer-events' },
  { label: 'New Event', path: '/events/new' },
];

export default function OrganizerListItem({ toggleMenu }: Props) {
  const router = useRouter();

  const clickHandler = (path: string) => {
    router.push(path);
    toggleMenu(false);
  };
  return (
    <>
      {OrganizerBtns.map((button, index) => (
        <Button
          key={index}
          onClick={() => clickHandler(button.path)}
          variant='outlined'
          color='primary'
          sx={{
            width: '100%',
            m: '0 auto 1.25rem',
          }}
        >
          {button.label}
        </Button>
      ))}
    </>
  );
}
