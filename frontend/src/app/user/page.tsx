'use client';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import EventList from '@/components/events/eventList';
import SearchBar from '@/components/searchBar';
import { Typography, Box, useMediaQuery, Skeleton } from '@mui/material';
import { CurrentUser, Event } from '@/types/pages.types';
import { api } from '@/services/api';
import SwitchViews from '@/components/events/switchViews';
import React from 'react';
import Profile from '@/components/user/profile';

function UserPage() {
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

  const getUpcomingOrganizerEvents = async () => {
    try {
      const response = await api.get(`/api/events/owner/${user?.id}`);

      setEvents(response.data);
    } catch (error) {}
  };

  const getPastOrganizerEvents = async () => {
    try {
      const response = await api.get(`/api/events/owner/past/${user?.id}`);
      setEvents(response.data);
    } catch (error) {}
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
    if (user && user.roleId === 1) {
      if (isPastEvents) {
        getPastOrganizerEvents();
      } else {
        getUpcomingOrganizerEvents();
      }
    } else {
      if (isPastEvents) {
        getUserPastEvents();
      } else {
        getUserUpcomingEvents();
      }
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
      <Profile />
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
        <Box sx={{ minHeight: '100%', minWidth: '100%', marginBottom: '18px' }}>
          <Skeleton variant='rectangular' width={'100%'} height={722} />
        </Box>
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
            isOrganizer={currentUser.role === 'organizer'}
          />
        </>
      )}
    </Box>
  );
}

export default UserPage;
