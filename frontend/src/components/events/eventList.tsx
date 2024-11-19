'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { AttendedEvent, Events as Event } from '@/types/pages.types';
import useMediaQuery from '@mui/material/useMediaQuery';
import NewEventCard from './newEventCard';

import EventCalendarView from './eventCalendarView';
import React from 'react';
import MobileEventCalendarView from './mobileEventCalendarView';
import NewEventModal from './newEventModal';

import { EventModalType } from '@/types/components.types';
import NewEventReviewModal from './newEventReviewModal';

type Props = {
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  user: {
    id: string | undefined;
    role: string | undefined;
  };
  handleLoadMoreEvents: () => void;
  emptyList: boolean;
  isUserPage?: boolean;
  isCalendarView?: boolean;
  pastEvents: boolean;
  attendedEvents?: AttendedEvent[];
  query: boolean;
  isOrganizer?: boolean;
};

function EventList({
  events,
  user,
  setEvents,
  handleLoadMoreEvents,
  emptyList,
  isUserPage = false,
  isCalendarView = false,
  pastEvents,
  attendedEvents,
  query,
  isOrganizer = false,
}: Props) {
  const laptopQuery = useMediaQuery('(min-width:769px)');

  const [isModalOpen, setIsModalOpen] = useState<EventModalType>({
    eventId: 0,
    isOpen: false,
  });

  const checkAttendance = (id: number) => {
    const isAttended = attendedEvents!.some((event) => event.id_event === id);
    return isAttended;
  };

  const checkOwnership = (idEventOwner: string) => {
    return user.id === idEventOwner;
  };

  const openModal = (eventId: number) => {
    setIsModalOpen({ eventId: eventId, isOpen: true });
  };

  const closeModal = (eventId: number) => {
    setIsModalOpen({ eventId: 0, isOpen: false });

    setEvents((prevEvents: Event[]) =>
      prevEvents.filter((event) => event.id_event !== eventId)
    );
  };

  const closeReviewModal = () => {
    setIsModalOpen({ eventId: 0, isOpen: false });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        spacing={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '0',
          justifyContent: events.length > 2 ? 'space-between' : 'flex-start',
        }}
        useFlexGap
        flexWrap='wrap'
        direction={'row'}
      >
        {isCalendarView ? (
          <Box
            sx={{
              minHeight: '100%',
              minWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {laptopQuery ? (
              <EventCalendarView
                eventsToCalendar={events}
                attendedEvents={attendedEvents}
                user={user}
              />
            ) : (
              <MobileEventCalendarView events={events} />
            )}
          </Box>
        ) : (
          <>
            {events.length === 0 ? (
              <Typography
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  backgroundColor: 'primary.main',
                  width: '100%',
                  height: '4rem',
                  padding: '1rem',
                  margin: '9rem 0',
                  borderRadius: '5px',
                }}
              >
                {query
                  ? 'No events found'
                  : pastEvents
                  ? `No past ${isUserPage ? 'attended' : ''} events`
                  : `No upcoming events ${isUserPage ? 'to attend' : ''}`}
              </Typography>
            ) : (
              events.map((event, index) => {
                const attended = isUserPage
                  ? true
                  : checkAttendance(event.id_event);

                const isOwner = isOrganizer
                  ? checkOwnership(event.id_owner)
                  : false;

                return (
                  <NewEventCard
                    key={index}
                    event={event}
                    user={user}
                    isAttending={attended}
                    laptopQuery={laptopQuery}
                    pastEvent={pastEvents}
                    isOwner={isOwner}
                    isUserPage={isUserPage}
                    openModal={openModal}
                  />
                );
              })
            )}
          </>
        )}
      </Stack>
      <NewEventModal
        isOpen={isModalOpen}
        user={user}
        closeModal={closeModal}
        laptopQuery={laptopQuery}
      />
      <NewEventReviewModal
        isOpen={isModalOpen}
        user={user}
        closeModal={closeReviewModal}
        laptopQuery={laptopQuery}
      />

      {events.length !== 0 && !isCalendarView && (
        <Button
          fullWidth
          sx={{
            backgroundColor: '#FFD7F3',
            marginBottom: '2rem',
            marginTop: '2rem',
          }}
          disabled={emptyList || events.length < 6}
          onClick={() => handleLoadMoreEvents()}
        >
          {emptyList || events.length < 6
            ? 'No more events available'
            : 'Load more events'}
        </Button>
      )}
    </Box>
  );
}

export default EventList;
