'use client';
import { useEffect, useState, useContext } from 'react';
import { Box, Alert, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';
import EventList from '@/components/events/eventList';
import SearchBar from '@/components/searchBar';
import { UserContext } from '@/context/userContext';
import { Tag } from '@/types/types';
import { Events as Event, CurrentUser } from '@/types/pages.types';
import { AlertState } from '@/types/alert.types';

export default function EventsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);

  const [events, setEvents] = useState<Array<Event>>([]);
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [eventsOfUser, setEventsOfUser] = useState<Array<[number, boolean]>>(
    []
  );

  const [emptyList, setEmptyList] = useState(false);

  const [numberOfEvents, setNumberOfEvents] = useState(0);

  const [alert, setAlert] = useState<AlertState>({
    status: false,
    message: '',
    severity: 'info',
  });

  const laptopQuery = useMediaQuery('(min-width:769px)');

  const currentUser: CurrentUser = {
    id: user?.id!,
    role: user?.roleName!,
  };

  const getEvents = async () => {
    const {
      data: { events },
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/?start=${numberOfEvents}&qnt=6`
    );
    setEvents(events);

    if (currentUser.id) {
      const attendingEvents: [number, boolean][] = [];
      const {
        data: { events: userEvents },
      } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/user/${currentUser.id}`
      );

      userEvents.map((event: Event) => {
        let attendingEvent: [number, boolean] = [event.id_event, true];
        attendingEvents.push(attendingEvent);
      });

      setEventsOfUser(attendingEvents);
    }

    setIsLoading(false);
  };

  const handleLoadMoreEvents = async () => {
    const {
      data: { events },
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/?start=${
        numberOfEvents + 6
      }&qnt=6`
    );

    if (events.length !== 6) {
      setEvents(events);
      setEmptyList(true);
    } else {
      setEvents((prev) => [...prev, events]);
    }

    setNumberOfEvents((prev) => prev + 6);
  };

  useEffect(() => {
    getEvents();
  }, []);

  const searchEvents = (text: string) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/search/?text=` + text
      )
      .then((res) => {
        if (res.data.events.length === 0) {
          setEvents([]);
          setAlert({
            status: true,
            message: 'No events found',
            severity: 'info',
          });
          setTimeout(() => {
            setAlert({
              status: false,
              message: '',
              severity: 'info',
            });
          }, 5000);
        } else {
          setEvents(res.data.events);
          setTags(res.data.tags);
          setAlert({
            status: true,
            message:
              res.data.events.length === 1
                ? `${res.data.events.length} event found`
                : `${res.data.events.length} events found`,
            severity: 'info',
          });
          setTimeout(() => {
            setAlert({
              status: false,
              message: '',
              severity: 'info',
            });
          }, 5000);
        }
      });
  };

  if (isLoading) return <></>;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {alert.status && (
        <Alert
          severity='info'
          variant='filled'
          onClose={() =>
            setAlert({ status: false, message: '', severity: 'info' })
          }
          sx={{ position: 'absolute', top: '10px', zIndex: 9999 }}
        >
          {alert.message}
        </Alert>
      )}
      <SearchBar searchEvents={searchEvents} isDisabled={events.length === 0} />
      {events.length === 0 ? (
        <Typography
          sx={{
            position: 'absolute',
            top: '20rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            backgroundColor: '#141D4F',
            width: laptopQuery ? '50%' : '100%',
            height: '5rem',
            padding: '1rem',
            borderRadius: '5px',
          }}
        >
          No events found
        </Typography>
      ) : (
        <EventList
          events={events}
          setEvents={setEvents}
          tags={tags}
          user={currentUser}
          attendance={eventsOfUser}
          handleLoadMoreEvents={handleLoadMoreEvents}
          emptyList={emptyList}
        />
      )}
    </Box>
  );
}
