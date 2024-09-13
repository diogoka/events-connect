import { Box, Typography } from '@mui/material';
import React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GridViewIcon from '@mui/icons-material/GridView';

type Props = {
  isCalendarView: boolean;
  setIsCalendarView: React.Dispatch<React.SetStateAction<boolean>>;
};

const SwitchViews = ({ isCalendarView, setIsCalendarView }: Props) => {
  console.log('isCalendarView', isCalendarView);
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
        <Box
          sx={{
            background: 'none',
            backgroundColor: isCalendarView ? '' : '#FFD7F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            borderRadius: '6px',
            border: '0',
            cursor: 'pointer',
          }}
          component={'button'}
          onClick={() => setIsCalendarView(false)}
        >
          <GridViewIcon />
        </Box>
        <Box
          sx={{
            background: 'none',
            backgroundColor: isCalendarView ? '#FFD7F3' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            borderRadius: '6px',
            border: '0',
            cursor: 'pointer',
          }}
          component={'button'}
          onClick={() => setIsCalendarView(true)}
        >
          <CalendarMonthIcon />
        </Box>
      </Box>
    </Box>
  );
};

export default SwitchViews;
