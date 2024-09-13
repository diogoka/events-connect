'use client';
import { Button, Stack } from '@mui/material';

import { Events as Event } from '@/types/pages.types';
import { Tag } from '@/types/types';
import EventItem from '@/components/events/eventItem';
import Pagination from '@mui/material/Pagination';
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import NewEventCard from './newEventCard';

import SwitchViews from './switchViews';

type Props = {
  events: Event[];
  tags: Tag[];
  setEvents: (events: Event[]) => void;
  user: {
    id: string | undefined;
    role: string | undefined;
  };
  attendance: [number, boolean][];
  handleLoadMoreEvents: () => void;
  emptyList: boolean;
};

function EventList({
  events,
  tags,
  user,
  setEvents,
  attendance,
  handleLoadMoreEvents,
  emptyList,
}: Props) {
  const laptopQuery = useMediaQuery('(min-width:769px)');
  const [isCalendarView, setIsCalendarView] = useState<boolean>(false);

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

  const today = new Date();

  useEffect(() => {
    console.log(events);
  }, []);

  return (
    <>
      <Stack
        spacing={2}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '0',
          width: '100%',
        }}
        direction={laptopQuery ? 'row' : 'column'}
        useFlexGap
        flexWrap='wrap'
      >
        <SwitchViews
          isCalendarView={isCalendarView}
          setIsCalendarView={setIsCalendarView}
        />

        {isCalendarView ? (
          <div>calendar</div>
        ) : (
          events.map((event, index) => {
            const attending = checkAttendance(event.id_event);

            return (
              // Old Event Item:
              // <EventItem
              //   event={event}
              //   key={index}
              //   tags={eventTags}
              //   user={user}
              //   deleteEvent={deleteEvent}
              //   attending={attending}
              //   oldEvent={oldEvent}
              //   page={currentPage}
              // />

              <NewEventCard
                key={index}
                event={event}
                user={user}
                attending={attending}
              />
            );
          })
        )}
      </Stack>
      <Button
        fullWidth
        sx={{
          backgroundColor: '#FFD7F3',
          marginBottom: '2rem',
          marginTop: '2rem',
        }}
        disabled={emptyList}
        onClick={() => handleLoadMoreEvents()}
      >
        {emptyList ? 'No more events available' : 'Load more events'}
      </Button>
    </>
  );
}

export default EventList;
