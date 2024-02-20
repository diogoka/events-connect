import React from 'react';
import Switcher from '../common/switcher';
import { useState, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { Avatar, IconButton, Drawer } from '@mui/material';
import Hamburger from './hamburger';
import Dropdown from './dropdown';

export default function AvatarIcon() {
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
    <Switcher
      sp={
        <>
          <IconButton onClick={() => toggleMenu(true)} sx={{ p: 0 }}>
            <Avatar
              alt={user?.firstName}
              src={`${
                user?.provider === 'password'
                  ? user.avatarURL
                  : firebaseAccount?.photoURL
              }`}
            ></Avatar>
          </IconButton>
          <Drawer
            anchor='right'
            open={isMenuOpen}
            onClose={() => toggleMenu(false)}
          >
            <Hamburger toggleMenu={toggleMenu} />
          </Drawer>
        </>
      }
      pc={
        <>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              alt={user?.firstName}
              src={`${
                user?.provider === 'password'
                  ? user.avatarURL
                  : firebaseAccount?.photoURL
              }`}
            ></Avatar>
          </IconButton>
          <Dropdown anchorEl={anchorEl} open={open} handleClose={handleClose} />
        </>
      }
    />
  );
}
