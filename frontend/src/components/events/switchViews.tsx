import { Box, Typography } from '@mui/material';
import React from 'react';
import GoogleIcon from '../icons/googleIcon';

type Props = {
  isCalendarView: boolean;
  setIsCalendarView: React.Dispatch<React.SetStateAction<boolean>>;
};

const SwitchViews = ({ isCalendarView, setIsCalendarView }: Props) => {
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
      <Box sx={{ display: 'flex', width: '100%', gap: '24px' }}>
        <Typography
          sx={{
            color: '#1B1B21',
            fontSize: '20px',
            fontWeight: 'bold',
            textDecoration: 'underline',
            textUnderlineOffset: '8px',
            textDecorationColor: '#B8C3FF',
          }}
        >
          Upcoming
        </Typography>
        <Typography
          sx={{
            color: '#1B1B21',
            fontSize: '20px',
          }}
        >
          Previous
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '22%',
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
          <GoogleIcon name='grid_view' size={20} outlined weight={200} />
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
          <GoogleIcon name='calendar_month' size={20} outlined weight={200} />
        </Box>
      </Box>
    </Box>
  );
};

export default SwitchViews;
