import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

type Props = {
  toggleMenu: (isMenuOpen: boolean) => void;
};

const UsersBtns = [
  { label: 'Home', path: '/' },
  { label: 'My Events', path: '/user/my-events' },
  { label: 'History', path: '/history' },
  { label: 'My Profile', path: '/user' },
];

export default function UsersListItem({ toggleMenu }: Props) {
  const router = useRouter();

  const clickHandler = (path: string) => {
    router.push(path);
    toggleMenu(false);
  };

  return (
    <>
      {UsersBtns.map((button, index) => (
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
