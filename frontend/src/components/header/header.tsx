'use client';
import Switcher from '../common/switcher';
import HeaderMB from './headerMB';
import HeaderPC from './headerPC';
import { AppBar } from '@mui/material';

export default function Header() {
  return (
    <AppBar
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        boxShadow: 'none',
        borderBottom: 'none',
        padding: '16px 24px',
        marginBottom: '24px',
      }}
    >
      <Switcher sp={<HeaderMB />} pc={<HeaderPC />} />
    </AppBar>
  );
}
