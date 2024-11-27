'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Stack,
  Typography,
  useMediaQuery,
  Skeleton,
  Fade,
} from '@mui/material';
import { UserContext } from '@/context/userContext';
import { Attendee, Event } from '@/types/types';
import { api } from '@/services/api';
import AttendeesModal from '@/components/event/attendees/attendees-modal';
import MapWithMarker from '@/components/map/mapWithMarker';
import { EventAttendee } from '@/types/pages.types';
import CardButton from '@/components/events/newEventCardButton';
import NewEventModal from '@/components/events/newEventModal';
import { EventModalType } from '@/types/components.types';
import ModalAttendParticipation from '@/components/event/modal-attend-participation';
import { useSnack } from '@/context/snackContext';
import { EventContext } from '@/context/eventContext';

import dayjs, { Dayjs } from 'dayjs';

import { Tag } from '@/types/types';
import DownloadAttendees from '@/components/event/download-attendees';
import NewEventReviewModal from '@/components/events/newEventReviewModal';
import FadeSkeleton from '@/components/common/fadeSkeleton';
import EventInformation from '@/components/events/eventInformation';

export default function EventPage() {
  const { user } = useContext(UserContext);
  const { dispatch } = useContext(EventContext);
  const [event, setEvent] = useState<Event>();
  const [attendees, setAttendees] = useState<Attendee[]>([] as Attendee[]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAttending, setIsAttending] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isPastEvent, setIsPastEvent] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState<EventModalType>({
    eventId: 0,
    isOpen: false,
  });

  const [isCancelModalOpen, setIsCancelModalOpen] = useState<EventModalType>({
    eventId: 0,
    isOpen: false,
  });

  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const params = useParams();
  const EVENT_ID = params.id;
  const isMobile = useMediaQuery('(max-width:1150px)');

  const router = useRouter();
  const { openSnackbar } = useSnack();

  const closeReviewModal = () => {
    setIsReviewModalOpen({ eventId: 0, isOpen: false });
  };

  const openReviewModal = (eventId: number) => {
    setIsReviewModalOpen({ eventId: eventId, isOpen: true });
  };

  const getEvent = async () => {
    try {
      const { data } = await api.get(`/api/events/${EVENT_ID}`);
      setEvent(data.event);

      const isAttending = await checkAttendance(
        data.event.attendees,
        user?.id!
      );
      const isOwner = await checkOwnerShip(data.event.id_owner);
      const isPast = checkIfPastEvent(data.event.date_event_end);
      setIsOwner(isOwner!);
      setIsAttending(isAttending);
      setIsPastEvent(isPast);
      setAttendees(data.event.attendees);
    } catch (error) {
      openSnackbar(`Something wrong. Try again later.${error}`, 'error');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfPastEvent = (eventEndDate: string) =>
    dayjs(eventEndDate).isBefore(dayjs());

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleDeleteAttendee = async () => {
    try {
      await api.delete('api/events/attendee', {
        data: {
          eventId: EVENT_ID,
          userId: user!.id,
        },
      });
      const updateAttendees = deleteAttendee(attendees, user!.id);
      setAttendees(await updateAttendees);
      setIsAttending(false);
    } catch (error) {}
  };

  const handleAddAttendee = async () => {
    try {
      await api.post(
        'api/events/attendee',
        {
          eventId: EVENT_ID,
          userId: user!.id,
        },
        { headers: { 'Content-type': 'application/json' } }
      );
      setIsAttending(true);
      await getEvent();
      openSnackbar('You have successfully applied to this event', 'success');
    } catch (error) {}
  };

  type TagType = {
    id_tag: number;
    name_tag: string;
  };

  const checkModality = (data: Tag[]) => {
    let modality: Tag = {} as Tag;
    let tagsArray: TagType[] = [];

    data.forEach(({ tags }: Tag) => {
      if (tags.id_tag === 16 || tags.id_tag === 17 || tags.id_tag === 18) {
        modality = { tags: { id_tag: tags.id_tag, name_tag: tags.name_tag } };
      } else {
        tagsArray.push({ id_tag: tags.id_tag!, name_tag: tags.name_tag! });
      }
    });
    return { modality, tagsArray };
  };

  const handleClickEvent = async () => {
    if (!user) {
      router.push('/login');
    } else {
      if (isOwner) {
        if (event) {
          const { modality, tagsArray } = checkModality(event.events_tags);
          const dateStart: Dayjs = dayjs(event.date_event_start);
          const dateEnd: Dayjs = dayjs(event.date_event_end);
          dispatch({
            type: 'UPDATE_ALL_FIELDS',
            payload: {
              name_event: event.name_event,
              description_event: event.description_event,
              capacity_event: +event.capacity_event,
              location_event: event.location_event,
              price_event: +event.price_event,
              category_event: event.category_event,
              image_event: event.image_url_event,
              modality: {
                id_tag: modality.tags.id_tag!,
                name_tag: modality.tags.name_tag!,
              },
              selectedTags: tagsArray,
              dates: [{ dateStart, dateEnd }],
              event_id: event.id_event,
            },
          });
        }
        router.push('/events/new');
      } else {
        if (isPastEvent) {
          openReviewModal(event?.id_event!);
        } else {
          if (isAttending) {
            openModal(+EVENT_ID);
          } else {
            if (event?.price_event! > 0) {
              openAttendingModal();
            } else {
              handleAddAttendee();
            }
          }
        }
      }
    }
  };

  const checkAttendance = async (
    attendeesList: EventAttendee[],
    userId: string
  ) => {
    let isAttending = false;
    attendeesList.map(({ users }) => {
      if (users.id_user === userId) {
        isAttending = true;
      }
    });
    return isAttending;
  };

  const deleteAttendee = async (attendeesList: Attendee[], userId: string) => {
    const updatedList = attendeesList.filter(
      ({ users }) => users.id_user !== userId
    );
    return updatedList;
  };

  const checkOwnerShip = async (eventOwnerId: string) => {
    if (user) {
      return user.id === eventOwnerId;
    }
  };

  const openModal = (eventId: number) => {
    setIsCancelModalOpen({ eventId: eventId, isOpen: true });
  };

  const closeModal = (eventId: number) => {
    setIsCancelModalOpen({ eventId: 0, isOpen: false });
  };

  const openAttendingModal = () => {
    setIsAttendModalOpen(true);
  };

  const closeAttendModal = () => setIsAttendModalOpen(false);

  useEffect(() => {
    getEvent();
  }, [isAttending, user]);

  return (
    <>
      <AttendeesModal
        attendees={attendees}
        open={isModalOpen}
        handleClose={handleCloseModal}
      />
      {/* Stack for entire page. */}
      <Stack rowGap={'40px'}>
        {/* Image */}
        <Box
          sx={{
            minWidth: '100%',
            minHeight: '218px',
            position: 'relative',
          }}
        >
          {!imageLoaded && (
            <Skeleton
              variant='rectangular'
              width='100%'
              height='218px'
              animation='wave'
              sx={{
                borderRadius: '4px',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          )}
          <Fade in={imageLoaded} timeout={1500} easing='ease-in'>
            <Box
              component='img'
              src={event?.image_url_event || ''}
              alt='Event Ima ge'
              onLoad={() => setImageLoaded(true)}
              sx={{
                display: imageLoaded ? 'block' : 'none',
                width: '100%',
                height: '218px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          </Fade>
        </Box>
        {/* Title */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{ fontSize: '36px', fontWeight: 700, textAlign: 'center' }}
          >
            {isLoading || !event ? (
              <FadeSkeleton variant='text' width='600px' height='100%' />
            ) : (
              <>{event?.name_event}</>
            )}
          </Typography>
        </Box>

        {/* Event information */}

        {isLoading || !event ? (
          <>
            <FadeSkeleton
              variant='rectangular'
              width={'100%'}
              height={'70px'}
            />
          </>
        ) : (
          <>
            <EventInformation
              event={event!}
              attendees={attendees}
              isMobile={isMobile}
              setIsModalOpen={handleOpenModal}
            />
          </>
        )}

        {/* Description */}
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: '18px' }} component={'div'}>
            {isLoading || !event ? (
              <>
                <FadeSkeleton variant='text' width='100%' height='200px ' />
              </>
            ) : (
              <>
                <pre
                  style={{
                    fontFamily: 'inherit',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: event?.description_event || '',
                  }}
                />
              </>
            )}
          </Typography>
        </Box>
        {/* Location, tags and categories */}
        <Stack gap={'16px'} sx={{ marginBottom: '150px' }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 700 }}>
            Activity Location
          </Typography>
          <Box sx={{ width: '100%' }}>
            {isLoading || !event ? (
              <>
                <FadeSkeleton
                  variant='rectangular'
                  width='100%'
                  height='500px'
                />
              </>
            ) : (
              <>
                <MapWithMarker location={event?.location_event!} />
              </>
            )}
          </Box>

          <Box sx={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '18px' }}>Tags</Typography>

            <Box sx={{ display: 'flex', gap: '12px' }}>
              {isLoading || !event ? (
                <>
                  <FadeSkeleton
                    variant='rectangular'
                    width='100%'
                    height='70px'
                  />
                </>
              ) : (
                <>
                  {event?.events_tags.map(({ tags }, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#DFE1F9',
                        padding: '8px',
                        borderRadius: '6px',
                        maxWidth: 'fit-content',
                      }}
                    >
                      <Typography sx={{ fontSize: '18x', fontWeight: 500 }}>
                        {tags.name_tag}
                      </Typography>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Box>
          <Box sx={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '18px' }}>Categories</Typography>

            {isLoading || !event ? (
              <>
                <FadeSkeleton
                  variant='rectangular'
                  width='100%'
                  height='70px'
                />
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#DFE1F9',
                    padding: '8px',
                    borderRadius: '6px',
                    maxWidth: 'fit-content',
                  }}
                >
                  <Typography sx={{ fontSize: '18x', fontWeight: 500 }}>
                    {event?.category_event}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Stack>
      </Stack>

      {/* Sticky bar for price and button. */}
      <Box
        padding={isMobile ? '0 30px' : '0 104px'}
        left='0'
        width='100%'
        margin='0 auto'
        position='fixed'
        bottom='0'
        zIndex='201'
        style={{ backgroundColor: '#DFE1F9' }}
      >
        <Box
          sx={{
            maxWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            {isLoading || !event ? (
              <Skeleton
                width={82}
                height={60}
                animation={'wave'}
                variant='text'
              />
            ) : (
              <>
                <Typography sx={{ fontSize: '40px', fontWeight: 700 }}>
                  {event?.price_event! <= 0
                    ? 'Free'
                    : `$${event?.price_event}/`}
                </Typography>
                {event?.price_event! > 0 && (
                  <Typography sx={{ fontSize: '16px' }}>person</Typography>
                )}
              </>
            )}
          </Box>

          {isLoading || !event ? (
            <>
              <FadeSkeleton
                variant='rectangular'
                width={'12%'}
                height={'40px'}
              />
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: '32px' }}>
              <DownloadAttendees eventId={event!.id_event!} />
              <CardButton
                isUserPage={true}
                isOwner={isOwner}
                isAttending={isAttending}
                isPastEvent={isPastEvent}
                handleClickButtonCard={handleClickEvent}
                isDetail
                isDisabled={event?.capacity_event === 0}
              />
            </Box>
          )}
        </Box>
        <NewEventModal
          isOpen={isCancelModalOpen}
          user={{ id: user?.id, role: user?.roleName }}
          closeModal={closeModal}
          handleDeleteAttendees={handleDeleteAttendee}
          isMobile={isMobile}
        />
        <ModalAttendParticipation
          isOpen={isAttendModalOpen}
          onClose={closeAttendModal}
          isMobile={isMobile}
          addAttendee={handleAddAttendee}
        />
        <NewEventReviewModal
          isOpen={isReviewModalOpen}
          user={{ id: user?.id, role: user?.roleName }}
          closeModal={closeReviewModal}
          isMobile={isMobile}
        />
      </Box>
    </>
  );
}
