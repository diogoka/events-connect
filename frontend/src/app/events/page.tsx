'use client';
import { useEffect, useState, useContext } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import EventList from '@/components/events/eventList';
import SearchBar from '@/components/searchBar';
import { UserContext } from '@/context/userContext';
import { Events as Event, CurrentUser } from '@/types/pages.types';

import { api } from '@/services/api';

export default function EventsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState<Array<Event>>([]);
  const [eventsOfUser, setEventsOfUser] = useState<Array<[number, boolean]>>(
    []
  );
  const [isPastEvents, setIsPastEvents] = useState<boolean>(false);
  const [emptyList, setEmptyList] = useState(false);
  const [numberOfEvents, setNumberOfEvents] = useState(0);
  const [isCalendarView, setIsCalendarView] = useState<boolean>(false);

  const laptopQuery = useMediaQuery('(min-width:769px)');

  const currentUser: CurrentUser = {
    id: user?.id!,
    role: user?.roleName!,
  };

  const handlePastEventSwitch = () => {
    setIsLoading(true);
    setIsPastEvents((prev) => !prev);
    setEmptyList(false);
    setIsLoading(false);
  };

  const handleCalendarViewSwitch = () => {
    setIsLoading(true);
    setIsCalendarView((prev) => !prev);
    setEmptyList(false);
    setIsLoading(false);
  };

  const getUpcomingEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        `/api/events/upcoming/?start=${numberOfEvents}&qnt=6`
      );

      setEvents(data.events);
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

  const getPastEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        `/api/events/past/?start=${numberOfEvents}&qnt=6`
      );
      setEvents(data.events);
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

  useEffect(() => {
    if (isPastEvents) {
      getPastEvents();
    } else {
      getUpcomingEvents();
    }
  }, [isPastEvents]);

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
      <SearchBar searchEvents={() => {}} isDisabled={events.length === 0} />

      <EventList
        events={events}
        setEvents={setEvents}
        user={currentUser}
        attendance={eventsOfUser}
        handleLoadMoreEvents={handleLoadMoreEvents}
        emptyList={emptyList}
        setPastEvents={handlePastEventSwitch}
        pastEvents={isPastEvents}
        isCalendarView={isCalendarView}
        setIsCalendarView={handleCalendarViewSwitch}
      />
    </Box>
  );
}
