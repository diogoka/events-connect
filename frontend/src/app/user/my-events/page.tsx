'use client';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import EventList from '@/components/events/eventList';
import SearchBar from '@/components/searchBar';
import { Typography, Box, useMediaQuery } from '@mui/material';
import { CurrentUser, Event } from '@/types/pages.types';
import { api } from '@/services/api';
import SwitchViews from '@/components/events/switchViews';
import React from 'react';

function UserEvents() {
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<Array<Event>>([]);
  const laptopQuery = useMediaQuery('(min-width:769px)');
  const [numberOfEvents, setNumberOfEvents] = useState(0);
  const [isPastEvents, setIsPastEvents] = useState<boolean>(false);
  const [emptyList, setEmptyList] = useState(false);

  const currentUser: CurrentUser = {
    id: user?.id ? user!.id : '',
    role: user?.roleName ? user!.roleName : '',
  };

  const getUserUpcomingEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        `/api/events/upcoming/user/${user?.id}/?start=${numberOfEvents}&qnt=6`
      );
      setEvents(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserPastEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(
        `/api/events/past/user/${user?.id}/?start=${numberOfEvents}&qnt=6`
      );
      setEvents(data);
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
      getUserPastEvents();
    } else {
      getUserUpcomingEvents();
    }
  }, [isPastEvents]);

  if (!user) return;

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
      <SearchBar searchEvents={() => {}} />
      <Typography
        sx={{
          width: '100%',
          textAlign: 'start',
          fontSize: '28px',
          fontWeight: 700,
          marginTop: '24px',
        }}
      >
        My Events
      </Typography>

      <SwitchViews
        pastEvents={isPastEvents}
        setPastEvents={setIsPastEvents}
        isDesktop={laptopQuery}
        isUserPage={true}
      />
      {isLoading ? (
        <Box>LOADING</Box>
      ) : (
        <>
          <EventList
            events={events}
            setEvents={setEvents}
            user={currentUser}
            handleLoadMoreEvents={handleLoadMoreEvents}
            emptyList={emptyList}
            pastEvents={isPastEvents}
            isUserPage
            query={false}
          />
        </>
      )}
    </Box>
  );
}

export default UserEvents;
