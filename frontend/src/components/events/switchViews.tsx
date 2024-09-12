import { Box, Typography } from '@mui/material';
import React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GridViewIcon from '@mui/icons-material/GridView';

type Props = {};

const SwitchViews = (props: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '1rem',
        marginBottom: '1rem',
      }}
    >
      <Typography
        sx={{
          color: '#1B1B21',
          fontSize: '20px',
          fontWeight: 'bold',
          maxWidth: '30%',
        }}
      >
        Upcoming Activities
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '22%',
          paddingRight: '1rem',
        }}
      >
        <GridViewIcon />
        <CalendarMonthIcon />
      </Box>
    </Box>
  );
};

export default SwitchViews;
