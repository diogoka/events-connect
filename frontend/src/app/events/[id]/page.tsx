'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Stack, Typography, useMediaQuery, Button } from '@mui/material';
import { UserContext } from '@/context/userContext';
import { PageContext } from '@/context/pageContext';
import { Attendee, Event } from '@/types/types';
import Image from 'next/image';
import { monthDayFn, TimeFn } from '@/common/functions';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { api } from '@/services/api';
import AttendeesModal from '@/components/event/attendees/attendees-modal';
import MapWithMarker from '@/components/map/mapWithMarker';

import calendarIconDetailSvg from '../../../../public/icons/calendarIconSvgDetail.svg';
import scheduleIconSvgDetail from '../../../../public/icons/scheduleIconSvgDetail.svg';
import groupIconSvg from '../../../../public/icons/groupIconSvg.svg';
import nearMeIconSvg from '../../../../public/icons/nearMeIconSvg.svg';

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

export default function EventPage() {
  const { notFound } = useContext(PageContext);
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

  const params = useParams();
  const EVENT_ID = params.id;
  const laptopQuery = useMediaQuery('(max-width:769px)');

  const monthAndDay = monthDayFn(event?.date_event_start!);
  const startTime = TimeFn(event?.date_event_start!);
  const endTime = TimeFn(event?.date_event_end!);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState<EventModalType>({
    eventId: 0,
    isOpen: false,
  });

  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);

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
    }
  };

  const checkIfPastEvent = (eventEndDate: string) => {
    const currentDate = new Date();
    const eventDate = new Date(eventEndDate);
    return eventDate < currentDate;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
  }, [isAttending]);

  return (
    <>
      <AttendeesModal
        attendees={attendees}
        open={isModalOpen}
        handleClose={handleCloseModal}
      />
      <Stack rowGap={'40px'}>
        <Box
          sx={{
            minWidth: '100%',
            minHeight: '208px',
            backgroundImage: `url(${event?.image_url_event})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '4px',
          }}
        ></Box>
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
            {event?.name_event}
          </Typography>
        </Box>

        <Stack gap={1} direction={laptopQuery ? 'column' : 'row'}>
          <Box sx={{ width: '100%', display: 'flex', gap: '8px' }}>
            <Box
              sx={{
                width: '50%',
                backgroundColor: '#F5F2FA',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                gap: '8px',
              }}
            >
              <Image
                src={calendarIconDetailSvg}
                alt='calendar icon'
                height={24}
                width={24}
              />

              <Typography sx={{ fontSize: '18px' }}>{monthAndDay}</Typography>
            </Box>
            <Box
              sx={{
                width: '50%',
                backgroundColor: '#F5F2FA',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                gap: '8px',
              }}
            >
              <Image
                src={scheduleIconSvgDetail}
                alt='schedule icon'
                height={24}
                width={24}
              />
              <Typography sx={{ fontSize: '18px' }}>
                {startTime.replace(/\s+/g, '')} to {endTime.replace(/\s+/g, '')}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: '100%',
              backgroundColor: '#F5F2FA',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              gap: '8px',
            }}
          >
            <Image
              src={nearMeIconSvg}
              alt='near me icon'
              width={24}
              height={24}
            />
            <Typography
              component='a'
              sx={{
                textDecoration: 'underline',
                fontSize: '18px',
                cursor: 'pointer',
              }}
              href={`https://maps.google.com/?q=${event?.location_event}`}
              target='_blank'
            >
              {event?.location_event}
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              backgroundColor: '#F5F2FA',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Image
                src={groupIconSvg}
                alt='group icon'
                width={24}
                height={24}
              />

              {attendees?.length === 0 ? (
                <Typography sx={{ fontSize: '18px' }}>
                  No Attendees yet
                </Typography>
              ) : (
                <AvatarGroup max={5}>
                  {attendees.map((attendee, index) => (
                    <Avatar
                      key={index}
                      alt={'avatar'}
                      src={attendee.users.avatarURL}
                    />
                  ))}
                </AvatarGroup>
              )}
            </Box>

            {attendees.length > 0 && (
              <Button
                sx={{ fontSize: '18px', padding: '0 4px' }}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                All Attendees
              </Button>
            )}
          </Box>
        </Stack>

        <Box sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: '18px' }}>
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
          </Typography>
        </Box>
        <Stack gap={'16px'} sx={{ marginBottom: '150px' }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 700 }}>
            Activity Location
          </Typography>
          <Box sx={{ width: '100%' }}>
            <MapWithMarker location={event?.location_event!} />
          </Box>

          <Box sx={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '18px' }}>Tags</Typography>

            <Box sx={{ display: 'flex', gap: '12px' }}>
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
            </Box>
          </Box>
          <Box sx={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '18px' }}>Categories</Typography>
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
          </Box>
        </Stack>
      </Stack>
      <Box
        padding={laptopQuery ? '0 30px' : '0 104px'}
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
            <Typography sx={{ fontSize: '40px', fontWeight: 700 }}>
              ${event?.price_event}/
            </Typography>
            <Typography sx={{ fontSize: '16px' }}>person</Typography>
          </Box>

          {isOwner && isPastEvent ? (
            <DownloadAttendees eventId={event!.id_event!} />
          ) : (
            <CardButton
              isUserPage={true}
              isOwner={isOwner}
              isAttending={isAttending}
              isPastEvent={isPastEvent}
              handleClickButtonCard={handleClickEvent}
              isDetail
            />
          )}
        </Box>
        <NewEventModal
          isOpen={isCancelModalOpen}
          user={{ id: user?.id, role: user?.roleName }}
          closeModal={closeModal}
          handleDeleteAttendees={handleDeleteAttendee}
          laptopQuery={laptopQuery}
        />
        <ModalAttendParticipation
          isOpen={isAttendModalOpen}
          onClose={closeAttendModal}
          laptopQuery={laptopQuery}
          addAttendee={handleAddAttendee}
        />
        <NewEventReviewModal
          isOpen={isReviewModalOpen}
          user={{ id: user?.id, role: user?.roleName }}
          closeModal={closeReviewModal}
          laptopQuery={laptopQuery}
        />
      </Box>
    </>
  );
}
