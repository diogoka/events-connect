'use client';
import { Stack } from '@mui/material';
import { Event } from '@/app/events/page';
import { Tag } from '@/types/types';
import EventItem from '@/components/events/eventItem';
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
  events: Event[];
  tags: Tag[];
  setEvents: (events: Event[]) => void;
  user: {
    id: string | undefined;
    role: string | undefined;
  };
  attendance: [number, boolean][];
};

function EventList({ events, tags, user, setEvents, attendance }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const laptopQuery = useMediaQuery('(min-width:769px)');
  const eventsPerPage = laptopQuery ? 6 : 5;
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

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
        {currentEvents.map((event, index) => {
          const eventTags = tags.filter(
            (tag) => tag.id_event === event.id_event
          );
          const attending = checkAttendance(event.id_event);
          let oldEvent = new Date(event.date_event_end) < today;
          return (
            <EventItem
              event={event}
              key={index}
              tags={eventTags}
              user={user}
              deleteEvent={deleteEvent}
              attending={attending}
              oldEvent={oldEvent}
              page={currentPage}
            />
          );
        })}
      </Stack>
      {events.length > 6 && (
        <Pagination
          count={Math.ceil(events.length / eventsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant='outlined'
          shape='rounded'
          sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
        />
      )}
    </>
  );
}

export default EventList;
