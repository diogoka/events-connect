import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  Events as Event,
  CurrentUser,
  AttendedEvent,
} from '@/types/pages.types';
import NewEventCard from './newEventCard';
import Image from 'next/image';
import { monthDayFn, TimeFn } from '@/common/functions';
import scheduleIconSvg from '../../../public/icons/scheduleIconSvg.svg';

import arrowLeftIconSvg from '../../../public/icons/arrowLeftIconSvg.svg';
import arrowRightIconSvg from '../../../public/icons/arrowRightIconSvg.svg';
import { useRouter } from 'next/navigation';

type Props = {
  events: Event[];
  user: {
    id: string | undefined;
    role: string | undefined;
  };
  laptopQuery: boolean;
};

const EventsHappening = ({ events, user, laptopQuery }: Props) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const currentEvent = events[currentEventIndex];

  const router = useRouter();

  const startTime = TimeFn(currentEvent.date_event_start);
  const endTime = TimeFn(currentEvent.date_event_end);

  const handlePreviousEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentEventIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const handleNextEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentEventIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/events/${currentEvent.id_event}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        margin: '24px 0',
      }}
    >
      <Typography
        sx={{
          fontSize: '32px',
          fontWeight: 700,
          textAlign: 'start',
          marginBottom: '16px',
        }}
      >
        Currently Happening
      </Typography>

      <Box
        sx={{
          position: 'relative',
          minHeight: '208px',
          width: '100%',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          background: `linear-gradient(180deg, rgba(32, 37, 60, 0.24) 24%, rgba(32, 37, 60, 0.80) 80%), url(${currentEvent.image_url_event}) lightgray 50% / cover no-repeat`,
          overflow: 'hidden',
          marginBottom: '12px',
          border: 'none',
          cursor: 'pointer',
        }}
        component={'button'}
        onClick={(e) => handleCardClick(e)}
      >
        {events.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              left: '10px',
              zIndex: 2,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            component={'button'}
            onClick={(e) => handlePreviousEvent(e)}
          >
            <Image
              src={arrowLeftIconSvg}
              alt='left arrow icon'
              width={40}
              height={40}
            />
          </Box>
        )}
        <Box
          sx={{
            maxWidth: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#FFFFFF',
              zIndex: 1,
              textAlign: 'center',
            }}
          >
            {currentEvent.name_event}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            width: '100%',
            position: 'absolute',
            bottom: 0,
            paddingBottom: '24px',
          }}
        >
          <Image
            src={scheduleIconSvg}
            alt='schedule icon'
            width={18}
            height={18}
            style={{ zIndex: 1 }}
          />
          <Typography sx={{ color: '#FFFFFF', fontWeight: 500, zIndex: 1 }}>
            {startTime} to {endTime}
          </Typography>
        </Box>

        {events.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              right: '10px',
              zIndex: 2,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            component={'button'}
            onClick={(e) => handleNextEvent(e)}
          >
            <Image
              src={arrowRightIconSvg}
              alt='right arrow icon'
              width={40}
              height={40}
            />
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
          marginTop: '12px',
        }}
      >
        {events.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: currentEventIndex === index ? '24px' : '8px',
              height: '6px',

              borderRadius: '2px',
              backgroundColor:
                currentEventIndex === index ? '#4F5B92' : '#E3E1E9',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default EventsHappening;
