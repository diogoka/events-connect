import React from 'react';
import { useState, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { Avatar, IconButton, Drawer, Box } from '@mui/material';
import Hamburger from './hamburger';
import Dropdown from './dropdown';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';

type Props = {};

const HamburgerMenu = (props: Props) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, firebaseAccount } = useContext(UserContext);
  const toggleMenu = (isMenuOpen: boolean) => {
    setMenuOpen(isMenuOpen);
  };

  return (
    <Box
      sx={{
        minWidth: '40px',
        maxWidth: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <IconButton onClick={() => toggleMenu(true)} sx={{ p: 0 }}>
        <DensityMediumIcon />
      </IconButton>
      <Drawer anchor='left' open={isMenuOpen} onClose={() => toggleMenu(false)}>
        <Hamburger toggleMenu={toggleMenu} />
      </Drawer>
    </Box>
  );
};

export default HamburgerMenu;
