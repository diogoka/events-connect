import { Box, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import GoogleIcon from '../icons/googleIcon';

import { getYear, getMonth } from 'date-fns';

type Props = {
  isCalendarView?: boolean;
  setIsCalendarView?: Dispatch<SetStateAction<boolean>>;
  setPastEvents: Dispatch<SetStateAction<boolean>>;
  pastEvents: boolean;
  isUserPage?: boolean;
  isDesktop: boolean;
  getPastEventsOfMonth?: (month: number, year: number) => void;
  isPastMonthEvents: boolean;
  setIsPastMonthEvents: Dispatch<SetStateAction<boolean>>;
};

const SwitchViews = ({
  isCalendarView,
  setIsCalendarView,
  pastEvents,
  setPastEvents,
  isUserPage = false,
  isDesktop,
  getPastEventsOfMonth,
  isPastMonthEvents,
  setIsPastMonthEvents,
}: Props) => {
  const handleMonthPastEventsClick = () => {
    const currentYear = getYear(new Date());
    const currentMonth = getMonth(new Date()) + 1;
    getPastEventsOfMonth!(currentMonth, currentYear);
  };

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
          component={'button'}
          onClick={() => setPastEvents(false)}
          sx={{
            backgroundColor: 'inherit',
            border: 'none',
            color: '#1B1B21',
            fontSize: '20px',
            fontWeight: pastEvents || isPastMonthEvents ? 'none' : 'bold',
            textDecoration:
              pastEvents || isPastMonthEvents ? 'none' : 'underline',
            textUnderlineOffset: '8px',
            textDecorationColor: '#B8C3FF',
            cursor: 'pointer',
          }}
        >
          {isCalendarView && isDesktop ? 'All Activities' : 'Upcoming'}
        </Typography>

        {(!isDesktop || (isDesktop && !isCalendarView)) && (
          <Typography
            component={'button'}
            onClick={() => {
              if (!isDesktop && isCalendarView) {
                handleMonthPastEventsClick();
              } else {
                setPastEvents(true);
              }
            }}
            sx={{
              backgroundColor: 'inherit',
              border: 'none',
              color: '#1B1B21',
              fontSize: '20px',
              fontWeight: pastEvents || isPastMonthEvents ? 'bold' : 'none',
              textDecoration:
                pastEvents || isPastMonthEvents ? 'underline' : 'none',
              textUnderlineOffset: '8px',
              textDecorationColor: '#B8C3FF',
              cursor: 'pointer',
            }}
          >
            {isUserPage ? 'Attended' : ' Previous'}
          </Typography>
        )}
      </Box>

      {setIsCalendarView && (
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
      )}
    </Box>
  );
};

export default SwitchViews;
