'use client';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Box, Stack, Typography, useMediaQuery, Button } from '@mui/material';
import { UserContext } from '@/context/userContext';
import { PageContext } from '@/context/pageContext';
import { Attendee, Event, OtherInfo } from '@/types/types';
import Image from 'next/image';
import { monthDayFn, TimeFn } from '@/common/functions';
import GoogleIcon from '@/components/icons/googleIcon';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { api } from '@/services/api';
import AttendeesModal from '@/components/event/attendees/attendees-modal';

export default function EventPage() {
  const { notFound } = useContext(PageContext);
  const { user } = useContext(UserContext);

  const [event, setEvent] = useState<Event>();
  const [attendees, setAttendees] = useState<Attendee[]>([] as Attendee[]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [applied, setApplied] = useState<boolean>(false);

  const params = useParams();

  const EVENT_ID = params.id;
  const laptopQuery = useMediaQuery('(max-width:769px)');

  const monthAndDay = monthDayFn(event?.date_event_start!);
  const startTime = TimeFn(event?.date_event_start!);
  const endTime = TimeFn(event?.date_event_end!);

  const getEvent = async () => {
    try {
      const { data } = await api.get(`/api/events/${EVENT_ID}`);

      console.log('response', data.event);

      setEvent(data.event);

      setAttendees(data.event.attendees);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getEvent();
  }, [applied]);

  return (
    <>
      <AttendeesModal
        attendees={attendees}
        open={isModalOpen}
        handleClose={handleCloseModal}
      />
      <Stack rowGap={'40px'}>
        <Box sx={{ maxWidth: '100%', maxHeight: '208px' }}>
          <Image
            alt='image_event'
            src={event?.image_url_event!}
            height={600}
            width={600}
            style={{ width: '100%', height: '208px', borderRadius: '4px' }}
          />
        </Box>
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

        <Stack gap={1}>
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
              <GoogleIcon
                name='calendar_month'
                size={24}
                outlined
                weight={400}
                color='#4F5B92'
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
              <GoogleIcon
                name='schedule'
                size={24}
                outlined
                weight={400}
                color='#4F5B92'
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
            <GoogleIcon
              name='near_me'
              size={24}
              outlined
              weight={400}
              color='#4F5B92'
            />
            <Typography sx={{ textDecoration: 'underline', fontSize: '18px' }}>
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
              <GoogleIcon
                name='group'
                size={24}
                outlined
                weight={400}
                color='#4F5B92'
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

          <Box sx={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
            <Typography>Tags</Typography>

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
            <Typography>Categories</Typography>
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
        padding='0 30px'
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
          <Button variant='contained' sx={{ padding: '8px 16px' }}>
            Join Event
          </Button>
        </Box>
      </Box>
    </>
  );
}
