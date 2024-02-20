'use client';
import { useEffect, useState, useContext } from 'react';
import { Box, Alert, Typography, useMediaQuery } from '@mui/material';
import axios, { all } from 'axios';
import EventList from '@/components/events/eventList';
import SearchBar from '@/components/searchBar';
import { UserContext } from '@/context/userContext';
import SwitchButton from '@/components/events/switchButton';

type Event = {
  attendees?: any;
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

export default function PastEvent() {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<Array<Event>>([]);
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [eventsOfUser, setEventsOfUser] = useState<Array<[number, boolean]>>(
    []
  );
  const [alertSearchBar, setAlertSearchBar] = useState({
    status: false,
    message: '',
  });
  const [noEvents, setNoEvents] = useState<boolean>(false);

  const laptopQuery = useMediaQuery('(min-width:769px)');

  const currentUser: CurrentUser = {
    id: user ? user!.id : '',
    role: user ? user!.roleName : '',
  };

  const [allEvents, setAllEvents] = useState(false);

  const getEvents = async () => {
    const {
      data: { events, tags },
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events?past=true&attendees=true`
    );
    let eventsUserAttended = getEventsUserAttended(events);
    if (allEvents) {
      setEvents(events);
      events.length === 0 ? setNoEvents(true) : setNoEvents(false);
    } else {
      setEvents(eventsUserAttended);
      eventsUserAttended.length === 0 ? setNoEvents(true) : setNoEvents(false);
    }

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

    setIsLoading(false);
  };

  const getEventsUserAttended = (events: Array<Event>) => {
    const attendingEvents: Array<Event> = [];
    events.filter((event) => {
      event.attendees.map((attendee: any) => {
        if (attendee) {
          if (attendee.id_user === currentUser.id) {
            attendingEvents.push(event);
          }
        }
      });
    });
    return attendingEvents;
  };

  useEffect(() => {
    getEvents();
  }, [allEvents]);

  if (!user) return;

  const searchEvents = (text: string) => {
    let url = allEvents
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/search/?text=${text}&past=true`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/user/${currentUser.id}/?search=${text}&past=true`;
    axios.get(url).then((res) => {
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
        }, 3000);
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
        }, 3000);
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
      {alertSearchBar.status && (
        <Alert
          severity='info'
          variant='filled'
          onClose={() => setAlertSearchBar({ status: false, message: '' })}
          sx={{ position: 'absolute', top: '10px', zIndex: 9999 }}
        >
          {alertSearchBar.message}
        </Alert>
      )}
      <SearchBar searchEvents={searchEvents} isDisabled={noEvents} />
      <Box
        sx={{
          width: '98%',
          display: 'flex',
          justifyContent: 'start',
          minHeight: '64px',
        }}
      >
        <SwitchButton
          setSwitchButtonState={setAllEvents}
          titles={['All events', 'Attended events']}
        />
      </Box>
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
          tags={tags}
          user={currentUser}
          setEvents={setEvents}
          attendance={eventsOfUser}
        ></EventList>
      )}
    </Box>
  );
}
