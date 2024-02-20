import React from 'react';
import TitleContainer from './titleContainer';
import DescriptionContainer from './descriptionContainer';
import { Stack, Box } from '@mui/material';

type Props = {
  isMobile: boolean;
};

export default function BasicInfo({ isMobile }: Props) {
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
