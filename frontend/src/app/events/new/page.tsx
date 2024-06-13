'use client';
import { useEffect, useContext } from 'react';
import { EventContext, initialState } from '@/context/eventContext';
import { UserContext } from '@/context/userContext';
import EventsControl from '@/components/events/newEvents/eventsControl';
import { LoginStatus } from '@/types/context.types';

export default function NewEventPage() {
  const { createdEvent, dispatch, setImage } = useContext(EventContext);
  const { user, loginStatus } = useContext(UserContext);

  useEffect(() => {
    if (createdEvent) {
      dispatch({
        type: 'GET_WHOLE_DATA',
        payload: createdEvent,
      });
    } else {
      dispatch({ type: 'RESET', payload: initialState });
      setImage(null);
    }
  }, []);
  return (
    <>
      {loginStatus !== LoginStatus.LoggedIn || user?.roleId !== 1 ? (
        <></>
      ) : (
        <EventsControl eventId={-1} />
      )}
    </>
  );
}
