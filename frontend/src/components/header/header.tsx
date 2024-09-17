'use client';
import Switcher from '../common/switcher';
import HeaderMB from './headerMB';
import HeaderPC from './headerPC';
import { AppBar } from '@mui/material';

export default function Header() {
  return (
    <AppBar
      position='fixed'
      sx={{
        bgcolor: 'transparent',
        boxShadow: 'none',
        borderBottom: 'none',
      }}
    >
      <Switcher sp={<HeaderMB />} pc={<HeaderPC />} />
    </AppBar>
  );
}
