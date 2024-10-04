'use client';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { TextField, useMediaQuery, Grid, Button, Box } from '@mui/material';
import IconItem from './icons/iconItem';
import SearchIcon from '@mui/icons-material/Search';

import { InputAdornment } from '@mui/material';

type Props = {
  searchEvents: (text: string) => void;
  isDisabled: boolean;
  clearSearchBar?: boolean;
};

function SearchBar({ searchEvents, isDisabled, clearSearchBar }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const laptopQuery = useMediaQuery('(min-width:769px)');

  const handleSearch = (event: any) => {
    event.preventDefault();
    if (searchTerm === '') return;
    searchEvents(searchTerm);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setSearchTerm('');
  }, [clearSearchBar]);

  const gridContainerStyle = {
    // marginTop: laptopQuery ? '5rem' : '3rem',
    marginBottom: laptopQuery ? '3rem' : '1rem',
    height: '3rem',
  };

  return (
    <Grid container spacing={0} style={gridContainerStyle}>
      <Box
        sx={{ backgroundColor: '#EFEDF4', width: '100%', borderRadius: '6px' }}
      >
        <TextField
          value={isDisabled ? '' : searchTerm}
          onChange={handleInputChange}
          fullWidth
          disabled={isDisabled}
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
