import React from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { Event } from '@/types/pages.types';
import { Box, Button, Typography } from '@mui/material';
import { monthDayFn, TimeFn } from '@/common/functions';
import { ScheduleRounded } from '@mui/icons-material';

import { FaRegShareFromSquare } from 'react-icons/fa6';

type Props = {
  event: Event & {
    image_url_event?: string;
  };
  user: {
    id: string | undefined;
    role: string | undefined;
  };
  attending: boolean;
  oldEvent?: boolean;
};

const NewEventCard = ({ event, user, attending, oldEvent = false }: Props) => {
  console.log('Event', event);

  const startTime = TimeFn(event.date_event_start);
  const endTime = TimeFn(event.date_event_end);
  const monthAndDay = monthDayFn(event.date_event_start);

  return (
    <Card sx={{ width: '100%', boxShadow: 'none' }}>
      <CardMedia
        sx={{
          height: '208px',
          width: '100%',
          padding: '1rem',
          borderRadius: '4px',
        }}
        image={event.image_url_event}
        title='event_image'
      >
        <Box
          sx={{
            backgroundColor: ' #FBF8FF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 16px',
            borderRadius: '4px',
            width: '57px',
            height: '58px',
            margin: '1px, 0, 0, 1px',
          }}
        >
          <Typography>{monthAndDay.split(' ')[0]}</Typography>
          <Typography sx={{ fontWeight: '700' }}>
            {monthAndDay.split(' ')[1]}
          </Typography>
        </Box>
      </CardMedia>
      <CardContent
        sx={{
          padding: '1rem 0 0 0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <Typography sx={{ fontWeight: '700' }}>
            {event.name_event.length > 19
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
          >
            Join
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewEventCard;
