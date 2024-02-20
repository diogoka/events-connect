import React from 'react';
import { useContext, useState } from 'react';
import { EventContext } from '@/context/eventContext';
import {
  TextField,
  InputLabel,
  Stack,
  Box,
  InputAdornment,
} from '@mui/material';

export default function TitleContainer() {
  const { createdEvent, dispatch } = useContext(EventContext);
  const [countedTTL, setCountedTTL] = useState<number>(32);

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCountedTTL(32 - event.target.value.length);
    dispatch({
      type: 'UPDATE_TITLE',
      payload: { ...createdEvent, name_event: event.target.value },
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
        htmlFor='title'
        sx={{
          fontSize: '1.125rem',
          color: '#333',
        }}
      >
        Title{' '}
        <Box component={'span'} sx={{ color: '#f14c4c' }}>
          *
        </Box>
      </InputLabel>
      <TextField
        id='title'
        variant='outlined'
        placeholder='Please enter title'
        fullWidth
        size='small'
        color='secondary'
        type='text'
        value={createdEvent.name_event}
        onChange={changeTitle}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position='end'
              sx={{ color: countedTTL < 0 ? 'red' : '#CACFD2' }}
            >
              {countedTTL}
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
