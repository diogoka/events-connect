'use client';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import axios from 'axios';
import EventList from '@/components/events/eventList';
import SearchBar from '@/components/searchBar';
import { Typography, Box, Alert, useMediaQuery } from '@mui/material';

type Event = {
  capacity_event: number;
  category_event: string;
  date_event_end: string;
  date_event_start: string;
  description_event: string;
  id_event: number;
  id_owner: string;
  image_event: string;
  location_event: string;
  name_event: string;
  price_event: number;
};

type Tag = {
  id_event: number;
  name_tag: string;
};

type CurrentUser = {
  id: string;
  role: string;
};

interface HasEvents {
  eventFound: boolean;
  message: string;
}

function UserEvents() {
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<Array<Event>>([]);
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [eventsOfUser, setEventsOfUser] = useState<Array<[number, boolean]>>(
    []
  );
  const [hasEvents, setHasEvents] = useState<HasEvents>({} as HasEvents);
  const [alertSearchBar, setAlertSearchBar] = useState({
    status: false,
    message: '',
  });
  const [noEvents, setNoEvents] = useState<boolean>(false);

  const laptopQuery = useMediaQuery('(min-width:769px)');

  const currentUser: CurrentUser = {
    id: user?.id ? user!.id : '',
    role: user?.roleName ? user!.roleName : '',
  };

  const getEvents = async () => {
    const attendingEvents: [number, boolean][] = [];
    const {
      data: { events, tags },
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/user/${currentUser.id}`
    );
    if (events.length === 0) {
      setHasEvents({
        eventFound: false,
        message: 'You have not attended any events yet',
      });
      setNoEvents(true);
    } else {
      setHasEvents({
        eventFound: true,
        message: '',
      });
      setNoEvents(false);
    }
    setEvents(events);
    setTags(tags);
    events.map((event: Event) => {
      let attendingEvent: [number, boolean] = [event.id_event, true];
      attendingEvents.push(attendingEvent);
    });
    setEventsOfUser(attendingEvents);

    setIsLoading(false);
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (!user) return;

  const searchEvents = (text: string) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/user/${currentUser.id}/?search=${text}`
      )
      .then((res) => {
        if (res.data.events.length === 0) {
          setEvents([]);
          setAlertSearchBar({
            status: true,
            message: 'No events found',
          });
          setTimeout(() => {
            setAlertSearchBar({
              status: false,
              message: '',
            });
          }, 5000);
        } else {
          setEvents(res.data.events);
          setTags(res.data.tags);
          setAlertSearchBar({
            status: true,
            message:
              res.data.events.length === 1
                ? `${res.data.events.length} event found`
                : `${res.data.events.length} events found`,
          });
          setTimeout(() => {
            setAlertSearchBar({
              status: false,
              message: '',
            });
          }, 5000);
        }
      });
  };

  const closeAlert = () => {
    setTimeout(() => {
      setAlertSearchBar({
        status: false,
        message: '',
      });
    }, 1000);
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
      {alertSearchBar.status && (
        <Alert
          severity='info'
          variant='filled'
          onClose={closeAlert}
          sx={{ position: 'absolute', top: '10px', zIndex: 9999 }}
        >
          {alertSearchBar.message}
        </Alert>
      )}

      <SearchBar searchEvents={searchEvents} isDisabled={noEvents} />
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
          {hasEvents.message !== '' ? hasEvents.message : 'No events found'}
        </Typography>
      ) : (
        <EventList
          events={events}
          tags={tags}
          user={currentUser}
          setEvents={setEvents}
          attendance={eventsOfUser}
        ></EventList>
      )}
    </Box>
  );
}

export default UserEvents;
