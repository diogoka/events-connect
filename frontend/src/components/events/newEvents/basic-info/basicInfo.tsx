import React from 'react';
import TitleContainer from './titleContainer';
import DescriptionContainer from './descriptionContainer';
import { Stack, Box } from '@mui/material';

export default function BasicInfo({ isMobile }: { isMobile: boolean }) {
  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='center'
      spacing={{ sm: 2, md: 3 }}
      sx={{ width: '100%' }}
    >
      <TitleContainer />
      <DescriptionContainer isMobile={isMobile} />
    </Stack>
  );
}
