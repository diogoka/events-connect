'use client';
import { AppBar, Box, Toolbar, useMediaQuery } from '@mui/material';
import Logo from './logo';
import NewHeader from './newHeader';

export default function Header() {
  const laptopQuery = useMediaQuery('(min-width:769px)');
  return (
    <AppBar
      position='relative'
      sx={{
        bgcolor: 'inherit',
        boxShadow: 'none',
        padding: laptopQuery ? '18px 104px 32px 104px' : '16px 24px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Logo />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <NewHeader laptopQuery={laptopQuery} />
      </Box>
    </AppBar>
  );
}
