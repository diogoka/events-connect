'use client';
import React, { useState, ChangeEvent } from 'react';
import { TextField, useMediaQuery, Grid, Button } from '@mui/material';
import IconItem from './icons/iconItem';

type Props = {
  searchEvents: (text: string) => void;
  isDisabled: boolean;
};

function SearchBar({ searchEvents, isDisabled }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const laptopQuery = useMediaQuery('(min-width:769px)');

  const handleSearch = (event: any) => {
    event.preventDefault();
    if (searchTerm === '') return;
    searchEvents(searchTerm);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const gridContainerStyle = {
    marginTop: laptopQuery ? '4rem' : '2rem',
    marginBottom: laptopQuery ? '3rem' : '1rem',
    height: '3rem',
    width: laptopQuery ? '36.25rem' : '100%',
  };

  const textFieldStyle = {
    border: '0px solid #141D4F',
    borderRadius: '0px',
    borderTopLeftRadius: '5px',
    borderBottomLeftRadius: '5px',
    height: '3rem',
  };

  const gridIconContainerStyle = {
    height: '3rem',
    backgroundColor: '#141D4F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
  };

  return (
    <Grid container spacing={0} style={gridContainerStyle}>
      <Grid item xs={9.5} sx={{ height: '3rem' }}>
        <TextField
          value={isDisabled? '': searchTerm}
          onChange={handleInputChange}
          fullWidth
          InputProps={{
            style: textFieldStyle,
          }}
          sx={{ backgroundColor: isDisabled? '#eeeeee':'transparent' }} disabled={isDisabled}/>
      </Grid>
      <Grid item xs={2.5} style={gridIconContainerStyle}>
        <Button
          sx={{ width: '100%', backgroundColor: isDisabled? '#606080': null }}
          onClick={handleSearch}
          disabled={isDisabled}
        >
          <IconItem
            iconName='FaSearch'
            onClick={handleSearch}
            isClickable={true}
            color='white'
            size='1.3rem'
          />
        </Button>
      </Grid>
    </Grid>
  );
}

export default SearchBar;
