import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Divider } from '@mui/material';
import LogoutBtn from './logoutBtn';

type Props = {
  toggleMenu: (isMenuOpen: boolean) => void;
  role: string;
};

const UsersBtns = [
  { label: 'My Profile', path: '/user' },
  { label: 'My Events', path: '/user/my-events' },
];

export default function UsersListItem({ toggleMenu, role }: Props) {
  const router = useRouter();

  const clickHandler = (path: string) => {
    router.push(path);
    toggleMenu(false);
  };

  return (
    <>
      {UsersBtns.map((button, index) => (
        <>
          <Button
            key={index}
            onClick={() => clickHandler(button.path)}
            sx={{
              color: 'primary.contrastText',
              width: '100%',
              textAlign: 'start',
              display: 'flex',
              justifyContent: 'start',
              fontSize: '40px',
            }}
          >
            {button.label}
          </Button>
          <Divider
            variant='middle'
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              margin: '40px 0',
            }}
          />
        </>
      ))}
      <LogoutBtn />
    </>
  );
}
