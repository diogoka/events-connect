'use client';
import React, { useState } from 'react';
import { Autocomplete, InputLabel, TextField, Box, Stack } from '@mui/material';
import axios from 'axios';

type Props = {
  location: string;
  setLocation: (value: string) => void;
};

export default function Location({ location, setLocation }: Props) {
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

  const updateOptions = async (input: string) => {
    try {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/location?input=${input}`
      );
      setLocationOptions(result.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
      <Autocomplete
        value={location}
        options={locationOptions}
        onInputChange={(e, value) => {
          if (value) updateOptions(value);
        }}
        onChange={(e, value) => {
          if (value) setLocation(value);
        }}
        fullWidth
        disablePortal
        renderInput={(params) => {
          return (
            <Stack
              direction='column'
              justifyContent='center'
              alignItems='flex-start'
              spacing={1}
              sx={{ width: '100%' }}
            >
              <InputLabel sx={{ color: '#333' }}>
                Location{' '}
                <Box component={'span'} sx={{ color: '#f14c4c' }}>
                  *
                </Box>
              </InputLabel>
              <TextField {...params} placeholder='Please enter location' />
            </Stack>
          );
        }}
      />
    </>
  );
}
