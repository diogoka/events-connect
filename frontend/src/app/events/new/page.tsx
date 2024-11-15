'use client';
import { useEffect, useContext, useState } from 'react';
import { EventContext, initialState } from '@/context/eventContext';
import { UserContext } from '@/context/userContext';
import EventsControl from '@/components/events/newEvents/eventsControl';
import { LoginStatus } from '@/types/context.types';
import NewPreviewMode from '@/components/events/newPreviewMode';

import { useSnack } from '@/context/snackContext';

export default function NewEventPage() {
  const { createdEvent, dispatch, setImage, image } = useContext(EventContext);
  const { user, loginStatus } = useContext(UserContext);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { openSnackbar } = useSnack();

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

  const setToForm = () => {
    setIsPreviewMode(false);
  };

  const eventValidation = () => {
    const errors: string[] = [];

    if (!createdEvent.name_event.trim()) {
      errors.push('Event name is required.');
    }
    if (!createdEvent.description_event.trim()) {
      errors.push('Event description is required.');
    }
    if (
      !createdEvent.dates.length ||
      !createdEvent.dates[0].dateStart ||
      !createdEvent.dates[0].dateEnd
    ) {
      errors.push('Event dates are required.');
    }
    if (!createdEvent.location_event.trim()) {
      errors.push('Location is required.');
    }
    if (createdEvent.price_event < 0) {
      errors.push('Price must be greater than or equal to 0.');
    }
    if (!createdEvent.selectedTags.length) {
      errors.push('At least one tag must be selected.');
    }
    if (!createdEvent.modality?.id_tag) {
      errors.push('Event modality is required.');
    }
    if (!createdEvent.category_event.trim()) {
      errors.push('Event category is required.');
    }

    if (!image && createdEvent.image_event === '') {
      errors.push('Event image is required.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleToPreviewMode = () => {
    const { isValid, errors } = eventValidation();

    if (!isValid) {
      openSnackbar(
        `Please fix the following errors:\n- ${errors.join('\n- ')}`,
        'error'
      );
    } else {
      setIsPreviewMode(true);
    }
  };

  return (
    <>
      {loginStatus !== LoginStatus.LoggedIn || user?.roleId !== 1 ? (
        <></>
      ) : (
        <>
          {isPreviewMode ? (
            <NewPreviewMode setToForm={setToForm} ownerId={user.id} />
          ) : (
            <EventsControl setToPreview={handleToPreviewMode} />
          )}
        </>
      )}
    </>
  );
}
