'use client';
import React from 'react';
import { useContext, useState } from 'react';
import { EventContext } from '@/context/eventContext';
import {
  TextField,
  InputLabel,
  Box,
  Stack,
  InputAdornment,
} from '@mui/material';

import dynamic from 'next/dynamic';

const ReactQuillEditor = dynamic(() => import('./reactQuillEditor'), {
  ssr: false,
});

export default function DescriptionContainer({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const { createdEvent, dispatch } = useContext(EventContext);
  const [countedDesc, setCountedDesc] = useState<number>(1200);

  const changeDesc = (description: string) => {
    setCountedDesc(1200 - description.length);
    dispatch({
      type: 'UPDATE_DESCRIPTION',
      payload: { ...createdEvent, description_event: description },
    });
  };
  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='flex-start'
      spacing={1}
      sx={{ width: '100%' }}
    >
      <InputLabel
        htmlFor='description'
        sx={{
          fontSize: '1.125rem',
          color: '#333',
        }}
      >
        Description{' '}
        <Box component={'span'} sx={{ color: '#f14c4c' }}>
          *
        </Box>
      </InputLabel>

      <ReactQuillEditor
        onChange={(value) => {
          changeDesc(value);
        }}
        value={createdEvent.description_event}
      />
    </Stack>
  );
}
