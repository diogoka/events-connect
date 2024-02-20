import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { EventContext } from '@/context/eventContext';
import {
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@mui/material';

export default function Price() {
  const { createdEvent, dispatch } = useContext(EventContext);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);
  const [priceValue, setPriceValue] = useState<string>();

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    dispatch({
      type: 'UPDATE_PRICE',
      payload: { ...createdEvent, price_event: event.target.checked ? 0 : 1 },
    });
    setError(false);
  };
  const handleTextPriceChange = (event: any) => {
    setPriceValue(event.target.value);
    dispatch({
      type: 'UPDATE_PRICE',
      payload: { ...createdEvent, price_event: event.target.value },
    });
  };

  useEffect(() => {
    if (createdEvent.price_event === 0) {
      setChecked(true);
      setPriceValue('');
    } else if (createdEvent.price_event >= 1) {
      setChecked(false);
      setError(false);
      setPriceValue(createdEvent.price_event.toString());
    } else {
      setError(true);
      setChecked(false);
      setPriceValue('');
    }
  }, [createdEvent.price_event]);

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
          id='price'
          sx={{ marginBlock: '.5rem', fontSize: '1.125rem' }}
        >
          Price {''}
          <Box component={'span'} sx={{ color: '#f14c4c' }}>
            *
          </Box>
        </FormLabel>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          spacing={1}
        >
          <FormControlLabel
            label='Free'
            control={
              <Checkbox
                id='Free'
                checked={checked}
                onChange={handlePriceChange}
              />
            }
          />
          <FormHelperText
            sx={{ color: '#D00000', fontSize: '.8rem', lineHeight: '1.5rem' }}
          >
            {priceValue && !error
              ? 'Do not forget the payment instructions.'
              : ''}
          </FormHelperText>
        </Stack>

        <TextField
          variant='outlined'
          type='number'
          fullWidth
          value={priceValue}
          onChange={handleTextPriceChange}
          error={error}
          helperText={error ? 'Price must be greater than 0' : ''}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
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
