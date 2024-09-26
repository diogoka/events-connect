'use client';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Events as Event } from '@/types/pages.types';
import { Dispatch, SetStateAction, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import NewEventCard from './newEventCard';

import SwitchViews from './switchViews';
import EventCalendarView from './eventCalendarView';

type Props = {
  events: Event[];
  setEvents: (events: Event[]) => void;
  user: {
    id: string | undefined;
    role: string | undefined;
  };
  attendance: [number, boolean][];
  handleLoadMoreEvents: () => void;
  emptyList: boolean;
  setPastEvents: Dispatch<SetStateAction<boolean>>;
  pastEvents: boolean;
  isCalendarView?: boolean;
  setIsCalendarView?: () => void;
  isUserPage?: boolean;
};

function EventList({
  events,
  user,
  setEvents,
  attendance,
  handleLoadMoreEvents,
  emptyList,
  setPastEvents,
  pastEvents,
  isCalendarView,
  setIsCalendarView,
  isUserPage = false,
}: Props) {
  const laptopQuery = useMediaQuery('(min-width:769px)');

  const deleteEvent = async (id: number) => {
    const newEvents = await events.filter((event) => event.id_event !== id);
    setEvents(newEvents);
  };
  const checkAttendance = (id: number) => {
    for (let i = 0; i < attendance.length; i++) {
      if (attendance[i][0] === id) {
        return true;
      }
    }
    return false;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <SwitchViews
        isCalendarView={isCalendarView}
        setIsCalendarView={setIsCalendarView}
        pastEvents={pastEvents}
        setPastEvents={setPastEvents}
        isUserPage={isUserPage}
      />

      <Stack
        spacing={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '0',
          width: '100%',
        }}
        useFlexGap
        flexWrap='wrap'
        direction={'row'}
      >
        {isCalendarView ? (
          <Box
            sx={{
              height: '100%',
              minWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <EventCalendarView />
          </Box>
        ) : (
          <>
            {events.length === 0 ? (
              <Typography
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  backgroundColor: 'primary.main',
                  width: laptopQuery ? '50%' : '100%',
                  height: '4rem',
                  padding: '1rem',
                  margin: '9rem 0',
                  borderRadius: '5px',
                }}
              >
                {pastEvents
                  ? `No past ${isUserPage ? 'attended' : ''} events`
                  : `No upcoming events ${isUserPage ? 'to attend' : ''}`}
              </Typography>
            ) : (
              events.map((event, index) => {
                const attending = checkAttendance(event.id_event);

                return (
                  <NewEventCard
                    key={index}
                    event={event}
                    user={user}
                    attending={attending}
                    laptopQuery={laptopQuery}
                  />
                );
              })
            )}
          </>
        )}
      </Stack>

      {events.length !== 0 && !isCalendarView && (
        <Button
          fullWidth
          sx={{
            backgroundColor: '#FFD7F3',
            marginBottom: '2rem',
            marginTop: '2rem',
          }}
          disabled={emptyList || events.length < 6}
          onClick={() => handleLoadMoreEvents()}
        >
          {emptyList || events.length < 6
            ? 'No more events available'
            : 'Load more events'}
        </Button>
      )}
    </Box>
  );
}

export default EventList;
