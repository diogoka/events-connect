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

type Props = {
  isMobile: boolean;
};
export default function DescriptionContainer({ isMobile }: Props) {
  const { createdEvent, dispatch } = useContext(EventContext);
  const [countedDesc, setCountedDesc] = useState<number>(500);

  const changeDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCountedDesc(500 - event.target.value.length);
    dispatch({
      type: 'UPDATE_DESCRIPTION',
      payload: { ...createdEvent, description_event: event.target.value },
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
      <TextField
        id='description'
        variant='outlined'
        placeholder='Please enter description'
        fullWidth
        color='secondary'
        type='textarea'
        multiline
        rows={isMobile ? 5 : 8}
        value={createdEvent.description_event}
        onChange={changeDesc}
        sx={{ position: 'relative' }}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position='end'
              sx={{
                color: countedDesc < 0 ? 'red' : '#CACFD2',
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
              }}
            >
              {countedDesc}
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
