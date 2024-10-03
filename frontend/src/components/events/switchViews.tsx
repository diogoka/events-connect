import { Box, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import calendarIconSvg from '../../../public/icons/calendarIconSvg.svg';
import gridIconSvg from '../../../public/icons/gridIconSvg.svg';

type Props = {
  isCalendarView?: boolean;
  setIsCalendarView?: Dispatch<SetStateAction<boolean>>;
  setPastEvents: Dispatch<SetStateAction<boolean>>;
  pastEvents: boolean;
  isUserPage?: boolean;
  isDesktop: boolean;
  getPastEventsOfMonth?: () => void;
  isPastMonthEvents?: boolean;
  setIsPastMonthEvents?: Dispatch<SetStateAction<boolean>>;
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
    getPastEventsOfMonth!();
    setIsPastMonthEvents!(true);
    setPastEvents(true);
  };

  const handleUpcomingSwitchClick = () => {
    setPastEvents(false);
    if (isCalendarView) {
      setIsPastMonthEvents!(false);
    }
  };

  const handlePastSwitchClick = () => {
    setPastEvents(true);
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
          onClick={() => handleUpcomingSwitchClick()}
          sx={{
            backgroundColor: 'inherit',
            border: 'none',
            color: '#1B1B21',
            fontSize: '20px',
            fontWeight: pastEvents ? 'none' : 'bold',
            textDecoration: pastEvents ? 'none' : 'underline',
            textUnderlineOffset: '8px',
            textDecorationColor: '#B8C3FF',
            cursor: 'pointer',
            padding: 0,
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
                handlePastSwitchClick();
              }
            }}
            sx={{
              backgroundColor: 'inherit',
              border: 'none',
              color: '#1B1B21',
              fontSize: '20px',
              fontWeight: pastEvents ? 'bold' : 'none',
              textDecoration: pastEvents ? 'underline' : 'none',
              textUnderlineOffset: '8px',
              textDecorationColor: '#B8C3FF',
              cursor: 'pointer',
              padding: 0,
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
            <Image src={gridIconSvg} alt='grid icon' width={20} height={20} />
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
            <Image
              src={calendarIconSvg}
              alt='grid icon'
              width={20}
              height={20}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SwitchViews;
