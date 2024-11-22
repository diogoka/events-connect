import { Stack, Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import calendarIconDetailSvg from '../../../public/icons/calendarIconSvgDetail.svg';
import scheduleIconSvgDetail from '../../../public/icons/scheduleIconSvgDetail.svg';
import groupIconSvg from '../../../public/icons/groupIconSvg.svg';
import nearMeIconSvg from '../../../public/icons/nearMeIconSvg.svg';
import spotsIconSvg from '../../../public/icons/spotsIcon.svg';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { monthDayFn, TimeFn } from '@/common/functions';
import { Attendee, Event } from '@/types/types';
import EventInformationContainer from './eventInformationField';

type Props = {
  isMobile: boolean;
  event: Event;
  attendees: Attendee[];
  setIsModalOpen: () => void;
};

const EventInformation = ({
  isMobile,
  event,
  attendees,
  setIsModalOpen,
}: Props) => {
  const monthAndDay = monthDayFn(event?.date_event_start!, isMobile);
  const startTime = TimeFn(event?.date_event_start!);
  const endTime = TimeFn(event?.date_event_end!);

  return (
    <Stack gap={isMobile ? 1 : 0} direction={isMobile ? 'column' : 'row'}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gap: isMobile ? '8px' : '0px',
        }}
      >
        <EventInformationContainer isMobile={isMobile} width='50%' firstField>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <Image
              src={calendarIconDetailSvg}
              alt='calendar icon'
              height={24}
              width={24}
            />
            {!isMobile && (
              <Typography sx={{ fontWeight: 700 }}>Date</Typography>
            )}
          </Box>
          <Typography
            sx={{
              fontSize: '18px',
              minHeight: '48px',
              maxHeight: '48px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {monthAndDay}
          </Typography>
        </EventInformationContainer>
        <EventInformationContainer isMobile={isMobile} width='50%'>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              src={scheduleIconSvgDetail}
              alt='schedule icon'
              height={24}
              width={24}
            />
            {!isMobile && (
              <Typography sx={{ fontWeight: 700 }}>Time</Typography>
            )}
          </Box>
          <Typography
            sx={{
              fontSize: '18px',
              minHeight: '48px',
              maxHeight: '48px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {startTime.replace(/\s+/g, '')} to {endTime.replace(/\s+/g, '')}
          </Typography>
        </EventInformationContainer>
      </Box>
      <EventInformationContainer isMobile={isMobile}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src={nearMeIconSvg}
            alt='near me icon'
            width={24}
            height={24}
          />
          {!isMobile && (
            <Typography sx={{ fontWeight: 700 }}>Location</Typography>
          )}
        </Box>
        <Typography
          component='a'
          sx={{
            textDecoration: 'underline',
            fontSize: '18px',
            cursor: 'pointer',
            minHeight: '48px',
            maxHeight: '48px',
            display: 'flex',
            alignItems: 'center',
          }}
          href={`https://maps.google.com/?q=${event?.location_event}`}
          target='_blank'
        >
          {event?.location_event}
        </Typography>
      </EventInformationContainer>
      <EventInformationContainer
        isMobile={isMobile}
        width={isMobile ? '100%' : '50%'}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Image src={spotsIconSvg} alt='spots icon' width={24} height={24} />
          {!isMobile && (
            <Typography sx={{ fontWeight: 700 }}>Spots </Typography>
          )}
        </Box>
        <Box
          sx={{
            minHeight: '48px',
            maxHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
          }}
        >
          {event?.capacity_event! < 0
            ? 'Unlimited spots'
            : event?.capacity_event === 0
            ? 'No available spots'
            : event?.capacity_event === 1
            ? '1 available spot'
            : `${event?.capacity_event} available spots`}
        </Box>
      </EventInformationContainer>
      <EventInformationContainer isMobile={isMobile} lastField>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Image src={groupIconSvg} alt='group icon' width={24} height={24} />
          {!isMobile && (
            <Typography sx={{ fontWeight: 700 }}>Attendees</Typography>
          )}
        </Box>

        {attendees.length === 0 ? (
          <Typography sx={{ fontSize: '18px' }}>No Attendees yet</Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <AvatarGroup max={5}>
              {attendees.map((attendee, index) => (
                <Avatar
                  key={index}
                  alt={'avatar'}
                  src={attendee.users.avatarURL}
                />
              ))}
            </AvatarGroup>
            <Button
              sx={{ fontSize: '18px', padding: '0 4px' }}
              onClick={() => {
                setIsModalOpen();
              }}
            >
              All Attendees
            </Button>
          </Box>
        )}
      </EventInformationContainer>
    </Stack>
  );
};

export default EventInformation;
