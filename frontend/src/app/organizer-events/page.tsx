'use client';
import { useEffect, useState, useContext } from 'react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';
import EventList from '@/components/events/eventList';
import SearchBar from '@/components/searchBar';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import SwitchButton from '@/components/events/switchButton';

type Event = {
  id_event: number;
  id_owner: string;
  name_event: string;
  description_event: string;
  date_event_start: string;
  date_event_end: string;
  location_event: string;
  capacity_event: number;
  price_event: number;
  image_event: string;
  category_event: string;
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

export default function OrganizerEventsPage() {
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<Array<Event>>([]);
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [eventsOfUser, setEventsOfUser] = useState<Array<[number, boolean]>>(
    []
  );
  const [hasEvents, setHasEvents] = useState<HasEvents>({} as HasEvents);
  const router = useRouter();
  const [switchButtonState, setSwitchButtonState] = useState<boolean>(false);
  const [noEvents, setNoEvents] = useState<boolean>(false);

  const currentUser: CurrentUser = {
    id: user!.id,
    role: user!.roleName,
  };
  const laptopQuery = useMediaQuery('(min-width:769px)');

  useEffect(() => {
    const fetchData = async () => {
      let url = switchButtonState
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/owner/${currentUser.id}?past=true`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/owner/${currentUser.id}`;

      const {
        data: { events, tags },
      } = await axios.get(url);
      if (events.length === 0) {
        setHasEvents({
          eventFound: false,
          message: switchButtonState
            ? // eslint-disable-next-line quotes
              "You don't have past events"
            : // eslint-disable-next-line quotes
              "You don't have upcoming events yet.",
        });
        setNoEvents(true);
      } else {
        setHasEvents({ eventFound: true, message: '' });
        setNoEvents(false);
      }
      setEvents(events);
      setTags(tags);

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

    fetchData();
  }, [switchButtonState]);

  if (!user) return;

  const searchEvents = (text: string) => {
    let url = switchButtonState
      ? `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/events/search/?text=${text}&id=${user!.id}&past=true`
      : `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/events/search/?text=${text}&id=${user!.id}`;
    axios
      .get(url)
      .then((res) => {
        if (res.data.events.length === 0) {
          setHasEvents({
            eventFound: false,
            message: 'No events found.',
          });
        } else {
          setHasEvents({ eventFound: true, message: '' });
        }
        setEvents(res.data.events);
        setTags(res.data.tags);
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  };

  const handleCreateEvent = () => {
    router.push('/events/new');
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
      <SearchBar searchEvents={searchEvents} isDisabled={noEvents} />
      {laptopQuery && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '98%',
          }}
        >
          <SwitchButton
            setSwitchButtonState={setSwitchButtonState}
            titles={['Past Events', 'Upcoming Events']}
          />
          <Button
            type='submit'
            variant='outlined'
            onClick={handleCreateEvent}
            sx={{
              marginBottom: '1rem',
              color: 'rgba(56, 116, 203, 1)',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              '&:hover': {
                backgroundColor: 'rgba(20,29,79)',
                color: 'white',
              },
            }}
          >
            New Event
          </Button>
        </Box>
      )}
      {hasEvents.eventFound ? (
        <EventList
          events={events}
          tags={tags}
          user={currentUser}
          setEvents={setEvents}
          attendance={eventsOfUser}
        ></EventList>
      ) : (
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
          {hasEvents.message}
        </Typography>
      )}
    </Box>
  );
}
