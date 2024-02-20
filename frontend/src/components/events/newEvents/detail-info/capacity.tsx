import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { EventContext } from '@/context/eventContext';
import {
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Stack,
  Box,
  FormControl,
  FormLabel,
} from '@mui/material';

export default function Capacity() {
  const { createdEvent, dispatch } = useContext(EventContext);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [spotValue, setSpotValue] = useState<string>();

  const handleSpotsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    dispatch({
      type: 'UPDATE_SPOTS',
      payload: {
        ...createdEvent,
        capacity_event: event.target.checked ? -1 : 1,
      },
    });
    setError(false);
  };

  const handleTextSpotsChange = (event: any) => {
    setSpotValue(event.target.value);
    dispatch({
      type: 'UPDATE_SPOTS',
      payload: { ...createdEvent, capacity_event: event.target.value },
    });
  };

  useEffect(() => {
    if (createdEvent.capacity_event === -1) {
      setIsChecked(true);
      setSpotValue('');
    } else if (createdEvent.capacity_event >= 1) {
      setIsChecked(false);
      setError(false);
      setSpotValue(createdEvent.capacity_event.toString());
    } else {
      setError(true);
      setIsChecked(false);
      setSpotValue('');
    }
  }, [createdEvent.capacity_event]);

  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='flex-start'
      spacing={1}
      sx={{ width: '100%' }}
    >
      <FormControl fullWidth>
        <FormLabel
          id='capacity'
          sx={{ marginBlock: '.5rem', fontSize: '1.125rem' }}
        >
          Spots {''}
          <Box component={'span'} sx={{ color: '#f14c4c' }}>
            *
          </Box>
        </FormLabel>
        <FormControlLabel
          label='Non limited people'
          control={
            <Checkbox checked={isChecked} onChange={handleSpotsChange} />
          }
        />

        <TextField
          variant='outlined'
          type='number'
          fullWidth
          value={spotValue}
          onChange={handleTextSpotsChange}
          error={error}
          helperText={error ? 'Spots must be greater than 1' : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                {createdEvent.capacity_event >= 2 ? 'people' : 'person'}
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiFormHelperText-root': {
              position: 'absolute',
              bottom: '-1rem',
            },
          }}
        />
      </FormControl>
    </Stack>
  );
}
