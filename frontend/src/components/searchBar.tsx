'use client';
import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { TextField, useMediaQuery, Grid, Button, Box } from '@mui/material';
import IconItem from './icons/iconItem';
import SearchIcon from '@mui/icons-material/Search';

import { InputAdornment } from '@mui/material';

type Props = {
  searchEvents: (text: string) => void;
  clearSearchBar?: boolean;
};

function SearchBar({ searchEvents, clearSearchBar }: Props) {
  const [query, setQuery] = useState<string>('');
  const laptopQuery = useMediaQuery('(min-width:769px)');

  const useDebounce = (callback: Function, delay: number) => {
    const timer = useRef<NodeJS.Timeout | null>(null);

    return (...args: any[]) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  useEffect(() => {
    setQuery('');
  }, [clearSearchBar]);

  const gridContainerStyle = {
    marginBottom: laptopQuery ? '3rem' : '1rem',
    height: '3rem',
  };

  const debouncedSearch = useDebounce(searchEvents, 600);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setQuery(text);
    debouncedSearch(text);
  };

  return (
    <Grid container spacing={0} style={gridContainerStyle}>
      <Box
        sx={{ backgroundColor: '#EFEDF4', width: '100%', borderRadius: '6px' }}
      >
        <TextField
          value={query}
          onChange={handleInputChange}
          fullWidth
          placeholder='Search for activities. E.g.: Tour.'
          variant='outlined'
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderWidth: '0px',
              },
              '&:hover fieldset': {
                borderWidth: '0px',
              },
              '&.Mui-focused fieldset': {
                borderWidth: '0px',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Grid>
  );
}

export default SearchBar;
