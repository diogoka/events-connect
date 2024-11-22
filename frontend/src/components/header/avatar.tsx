import React from 'react';
import { useState, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { Avatar, IconButton, Drawer, Box } from '@mui/material';
import Hamburger from './hamburger';
import Dropdown from './dropdown';

type Props = {
  laptopQuery: boolean;
};

export default function AvatarIcon({ laptopQuery }: Props) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, firebaseAccount } = useContext(UserContext);
  const toggleMenu = (isMenuOpen: boolean) => {
    setMenuOpen(isMenuOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {laptopQuery ? (
        <>
          <IconButton onClick={handleClick} size='large' sx={{ padding: '0' }}>
            <Avatar
              alt={user?.firstName}
              src={`${
                user?.provider === 'password'
                  ? user.avatarURL
                  : firebaseAccount?.photoURL
              }`}
            />
          </IconButton>
          <Dropdown anchorEl={anchorEl} open={open} handleClose={handleClose} />
        </>
      ) : (
        <>
          <Box>
            <IconButton onClick={() => toggleMenu(true)} sx={{ p: 0 }}>
              <Avatar
                alt={user?.firstName}
                src={`${
                  user?.provider === 'password'
                    ? user.avatarURL
                    : firebaseAccount?.photoURL
                }`}
              />
            </IconButton>
            <Drawer
              anchor='right'
              open={isMenuOpen}
              onClose={() => toggleMenu(false)}
            >
              <Hamburger toggleMenu={toggleMenu} />
            </Drawer>
          </Box>
        </>
      )}
    </>
  );
}
