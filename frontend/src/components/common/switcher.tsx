import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
  sp: React.ReactElement;
  pc: React.ReactElement;
  initial?: 'sp' | 'pc' | 'none';
}

export default function Switcher({
  pc,
  sp,
  initial = 'sp',
}: Props): React.ReactElement {
  const displaySP = useMediaQuery('(max-width: 768px)');
  const displayPC = useMediaQuery('(min-width: 769px)');
  if (displaySP) return sp;
  if (displayPC) return pc;
  if (initial === 'sp') return sp;
  if (initial === 'pc') return pc;
  return <></>;
}
