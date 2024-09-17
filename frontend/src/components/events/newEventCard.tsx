'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import { Box, Button, Typography } from '@mui/material';

import { Event } from '@/types/pages.types';
import { monthDayFn, TimeFn } from '@/common/functions';

import { ScheduleRounded } from '@mui/icons-material';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import EventImageWithDate from '../common/eventImageWithDate';

type Props = {
  event: Event & {
    image_url_event?: string;
  };
  user: {
    id: string | undefined;
    role: string | undefined;
  };
  attending?: boolean;
  laptopQuery: boolean;
};

const NewEventCard = ({ event, user, attending, laptopQuery }: Props) => {
  const startTime = TimeFn(event.date_event_start);
  const endTime = TimeFn(event.date_event_end);
  const monthAndDay = monthDayFn(event.date_event_start);

  const router = useRouter();

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleJoinEvent = () => router.push(`/events/${event.id_event}`);

  const handleShareEvent = () => {
    console.log('COPIED');
  };

  const handleSetLoadedImage = () => {
    setImageLoaded(true);
  };

  return (
    <Card sx={{ width: laptopQuery ? '32.1%' : '100%', boxShadow: 'none' }}>
      <EventImageWithDate
        imageLoaded={imageLoaded}
        imageUrl={event?.image_url_event!}
        monthAndDay={monthAndDay}
        handleLoadedImage={handleSetLoadedImage}
      />
      <CardContent
        sx={{
          padding: '1rem 0 0 0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <Typography sx={{ fontWeight: '700' }}>
            {event && event.name_event.length > 19
              ? `${event.name_event.slice(0, 20)}...`
              : event.name_event}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleRounded fontSize='inherit' sx={{ marginRight: '3px' }} />
            <Typography>
              {startTime} to {endTime}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '1.5rem',
              background: 'transparent',
              backgroundColor: 'transparent',
              padding: 0,
              border: 0,
              cursor: 'pointer',
            }}
            component={'button'}
            onClick={() => {
              handleShareEvent();
            }}
          >
            <FaRegShareFromSquare />
          </Box>
          <Button
            sx={{
              backgroundColor: '#DDE1FF',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '1rem',
            }}
            onClick={() => {
              handleJoinEvent();
            }}
          >
            Join
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewEventCard;
