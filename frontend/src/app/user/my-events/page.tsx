'use client';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import axios from 'axios';
import EventList from '@/components/events/eventList';
import SearchBar from '@/components/searchBar';
import ResetButton from '@/components/user/reset-button';
import { Typography, Box, Alert, useMediaQuery } from '@mui/material';
import { Tag, HasEvents, CurrentUser, Event } from '@/types/pages.types';
import { api } from '@/services/api';

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

  const [clearSearchBar, setClearSearchBar] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const [numberOfEvents, setNumberOfEvents] = useState(0);
  const [isPastEvents, setIsPastEvents] = useState<boolean>(false);
  const [emptyList, setEmptyList] = useState(false);

  const currentUser: CurrentUser = {
    id: user?.id ? user!.id : '',
    role: user?.roleName ? user!.roleName : '',
  };

  const resetEvents = async () => {
    await getEvents();
    clearSearchBar ? setClearSearchBar(false) : setClearSearchBar(true);
    setDisableButton(true);
  };

  const getUserUpcomingEvents = async () => {
    try {
      const { data } = await api.get(
        `/api/events/upcoming/user/${user?.id}/?start=${numberOfEvents}&qnt=6`
      );
      console.log('data', data);
      setEvents(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserPastEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        `/api/events/past/user/${user?.id}/?start=${numberOfEvents}&qnt=6`
      );
      setEvents(data);
      if (currentUser.id) {
        const attendingEvents: [number, boolean][] = [];
        const {
          data: { events: userEvents },
        } = await api.get(`/api/events/user/${currentUser.id}`);

        userEvents.map((event: Event) => {
          let attendingEvent: [number, boolean] = [event.id_event, true];
          attendingEvents.push(attendingEvent);
        });

        setEventsOfUser(attendingEvents);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePastEventSwitch = () => {
    setIsLoading(true);
    setIsPastEvents((prev) => !prev);
    setEmptyList(false);
    setIsLoading(false);
  };

  const handleLoadMoreEvents = async () => {
    try {
      if (!isPastEvents) {
        const {
          data: { events },
        } = await api.get(
          `/api/events/upcoming/?start=${numberOfEvents + 6}&qnt=6`
        );
        if (events.length !== 6) {
          setEvents(events);
          setEmptyList(true);
        } else if (events.length === 6) {
          setEmptyList(true);
        } else {
          setEvents((prev) => [...prev, events]);
        }
        setNumberOfEvents((prev) => prev + 6);
      } else {
        const {
          data: { events },
        } = await api.get(
          `/api/events/past/?start=${numberOfEvents + 6}&qnt=6`
        );

        if (events.length === 6) {
          setEvents((prev) => [...prev, ...events]);
          setEmptyList(false);
        } else {
          setEmptyList(true);
        }
        setNumberOfEvents((prev) => prev + 6);
      }
    } catch (error) {}
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
    if (isPastEvents) {
      getUserPastEvents();
    } else {
      getUserUpcomingEvents();
    }
  }, [isPastEvents]);

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
    setDisableButton(false);
  };

  const closeAlert = () => {
    setTimeout(() => {
      setAlertSearchBar({
        status: false,
        message: '',
      });
    }, 1000);
  };

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
      <SearchBar searchEvents={searchEvents} isDisabled={events.length === 0} />

      <EventList
        events={events}
        setEvents={setEvents}
        user={currentUser}
        attendance={eventsOfUser}
        handleLoadMoreEvents={handleLoadMoreEvents}
        emptyList={emptyList}
        setPastEvents={handlePastEventSwitch}
        pastEvents={isPastEvents}
        isUserPage={true}
      />
    </Box>
  );
}

export default UserEvents;
