'use client';
import { useEffect, useState, useContext } from 'react';
import { Box, Skeleton, useMediaQuery } from '@mui/material';
import EventList from '@/components/events/eventList';
import SearchBar from '@/components/searchBar';
import { UserContext } from '@/context/userContext';
import {
  Events as Event,
  CurrentUser,
  AttendedEvent,
} from '@/types/pages.types';

import { api } from '@/services/api';
import React from 'react';

import SwitchViews from '@/components/events/switchViews';
import { getYear, getMonth } from 'date-fns';
import EventsHappening from '@/components/events/eventHappening';
import { useSnack } from '@/context/snackContext';

export default function EventsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState<Event[]>([]);
  const [isPastEvents, setIsPastEvents] = useState<boolean>(false);
  const [emptyList, setEmptyList] = useState(false);
  const [numberOfUpcomingEvents, setNumberOfUpcomingEvents] = useState(0);
  const [numberOfPastEvents, setNumberOfPastEvents] = useState(0);
  const [isCalendarView, setIsCalendarView] = useState<boolean>(false);
  const [isPastMonthEvents, setIsPastMonthEvents] = useState(false);
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
  const [eventsHappening, setEventsHappening] = useState<Event[]>([]);

  const [query, setQuery] = useState(false);

  const laptopQuery = useMediaQuery('(min-width:769px)');

  const currentUser: CurrentUser = {
    id: user?.id!,
    role: user?.roleName!,
  };

  const { openSnackbar } = useSnack();

  const getUpcomingEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        `/api/events/upcoming/?start=${numberOfUpcomingEvents}&qnt=6`
      );

      const happeningNowEvents = data.events.filter((event: Event) =>
        isEventHappeningNow(event.date_event_start, event.date_event_end)
      );

      const upcomingEvents = data.events.filter(
        (event: Event) =>
          !isEventHappeningNow(event.date_event_start, event.date_event_end)
      );

      setEventsHappening(happeningNowEvents);
      setEvents(upcomingEvents);

      if (currentUser.id) {
        const { data } = await api.get(
          `/api/events/attended/user/${currentUser.id}`
        );
        setAttendedEvents(data);
      }
    } catch (error) {
      openSnackbar('Something went wrong. Try again later', 'error');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getPastEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        `/api/events/past/?start=${numberOfPastEvents}&qnt=6`
      );
      setEvents(data.events);
      if (currentUser.id) {
        const { data } = await api.get(
          `/api/events/attended/user/${currentUser.id}`
        );
        setAttendedEvents(data);
      }
    } catch (error) {
      openSnackbar('Something went wrong. Try again later', 'error');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getPastEventsOfMonth = async () => {
    try {
      const currentYear = getYear(new Date());
      const currentMonth = getMonth(new Date()) + 1;
      const { data } = await api.get(
        `/api/events/past/month/?month=${currentMonth}&year=${currentYear}`
      );

      setEvents(data);
    } catch (error) {
      openSnackbar(`Something went wrong ${error}`, 'warning');
    }
  };

  const getUpcomingEventsOfMonth = async () => {
    try {
      const currentYear = getYear(new Date());
      const currentMonth = getMonth(new Date()) + 1;
      const { data } = await api.get(
        `/api/events/upcoming/month/?month=${currentMonth}&year=${currentYear}`
      );

      setEvents(data);
    } catch (error) {
      openSnackbar(`Something went wrong ${error}`, 'warning');
    }
  };

  const handleLoadMoreEvents = async () => {
    try {
      if (!isPastEvents) {
        const {
          data: { events },
        } = await api.get(
          `/api/events/upcoming/?start=${numberOfUpcomingEvents + 6}&qnt=6`
        );
        if (events.length !== 6) {
          setEvents(events);
          setEmptyList(true);
        } else if (events.length === 6) {
          setEmptyList(true);
        } else {
          setEvents((prev) => [...prev, events]);
        }
        setNumberOfUpcomingEvents((prev) => prev + 6);
      } else {
        const {
          data: { events },
        } = await api.get(
          `/api/events/past/?start=${numberOfPastEvents + 6}&qnt=6`
        );

        if (events.length === 6) {
          setEvents((prev) => [...prev, ...events]);
          setEmptyList(false);
        } else {
          setEmptyList(true);
        }
        setNumberOfPastEvents((prev) => prev + 6);
      }
    } catch (error) {}
  };
  const isEventHappeningNow = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    return now >= startDate && now <= endDate;
  };

  const searchEvents = async (text: string) => {
    try {
      setIsLoading(true);
      const response = await api.post(
        `/api/events/search/?past=${isPastEvents}&text=${text}`
      );

      setEvents(response.data);
      if (text.length > 1) {
        setQuery(true);
      } else {
        setQuery(false);
      }
    } catch (error) {
      openSnackbar(`Something went wrong ${error}`, 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPastEvents) {
      if (isCalendarView) {
        if (laptopQuery) {
          getUpcomingEventsOfMonth();
        } else {
          getPastEventsOfMonth();
        }
      } else {
        setEmptyList(false);
        getPastEvents();
      }
    } else {
      if (isCalendarView) {
        getUpcomingEventsOfMonth();
      } else {
        setEmptyList(false);
        getUpcomingEvents();
      }
    }
  }, [isPastEvents, isPastMonthEvents, isCalendarView]);

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
      <SearchBar searchEvents={searchEvents} clearSearchBar={isPastEvents} />

      {eventsHappening.length > 0 && (
        <EventsHappening
          events={eventsHappening}
          user={currentUser}
          laptopQuery={laptopQuery}
        />
      )}

      <SwitchViews
        isCalendarView={isCalendarView}
        setIsCalendarView={setIsCalendarView}
        pastEvents={isPastEvents}
        setPastEvents={setIsPastEvents}
        isDesktop={laptopQuery}
        getPastEventsOfMonth={getPastEventsOfMonth}
        isPastMonthEvents={isPastMonthEvents}
        setIsPastMonthEvents={setIsPastMonthEvents}
        isOrganizer={currentUser.role === 'organizer'}
      />
      {isLoading ? (
        <Box sx={{ minHeight: '100%', minWidth: '100%', marginBottom: '18px' }}>
          <Skeleton variant='rectangular' width={'100%'} height={722} />
        </Box>
      ) : (
        <>
          <EventList
            events={events}
            setEvents={setEvents}
            user={currentUser}
            attendedEvents={attendedEvents}
            handleLoadMoreEvents={handleLoadMoreEvents}
            emptyList={emptyList}
            pastEvents={isPastEvents}
            isCalendarView={isCalendarView}
            query={query}
          />
        </>
      )}
    </Box>
  );
}
