'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Button, Typography } from '@mui/material';
import { Event } from '@/types/pages.types';
import { monthDayFn, TimeFn } from '@/common/functions';
import EventImageWithDate from '../common/eventImageWithDate';
import scheduleIconSvg from '../../../public/icons/scheduleIconSvg.svg';
import shareIconSvg from '../../../public/icons/iosShareIconSvg.svg';
import Image from 'next/image';
import { useSnack } from '@/context/snackContext';

type Props = {
  event: Event & {
    image_url_event?: string;
  };
  user: {
    id: string | undefined;
    role: string | undefined;
  };
  isAttending?: boolean;
  laptopQuery: boolean;
  pastEvent: boolean;
};

const NewEventCard = ({
  event,
  user,
  isAttending = false,
  laptopQuery,
  pastEvent,
}: Props) => {
  const startTime = TimeFn(event.date_event_start);
  const endTime = TimeFn(event.date_event_end);
  const monthAndDay = monthDayFn(event.date_event_start);

  const router = useRouter();

  const [imageLoaded, setImageLoaded] = useState(false);

  const { openSnackbar } = useSnack();

  const handleClickCard = () => router.push(`/events/${event.id_event}`);

  const handleShareEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentURL = window.location.href;
    navigator.clipboard.writeText(`${currentURL}/${event.id_event}`);
    openSnackbar('URL copied!', 'success');
  };

  const handleSetLoadedImage = () => {
    setImageLoaded(true);
  };

  return (
    <Card
      sx={{
        width: laptopQuery ? '32.1%' : '100%',
        boxShadow: 'none',
        backgroundColor: '#FBF8FF',
        cursor: 'pointer',
        border: 0,
        padding: 0,
      }}
      component={'button'}
      onClick={() => handleClickCard()}
    >
      <EventImageWithDate
        imageLoaded={imageLoaded}
        imageUrl={event?.image_url_event!}
        monthAndDay={monthAndDay}
        handleLoadedImage={handleSetLoadedImage}
        isAttending={isAttending}
        pastEvent={pastEvent}
      />
      <CardContent
        sx={{
          padding: '1rem 0 0 0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <Typography sx={{ fontWeight: '700', textAlign: 'start' }}>
            {event && event.name_event.length > 19
              ? `${event.name_event.slice(0, 20)}...`
              : event.name_event}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src={scheduleIconSvg}
              alt='schedule icon'
              width={18}
              height={18}
            />
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
            onClick={(event) => {
              handleShareEvent(event);
            }}
          >
            <Image src={shareIconSvg} alt='share icon' width={25} height={25} />
          </Box>
          <Button
            sx={{
              backgroundColor: '#DDE1FF',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '1rem',
              '&:disabled': {
                backgroundColor: 'rgba(27, 27, 33, 0.12)',
              },
            }}
            disabled={isAttending}
            onClick={() => {
              handleClickCard();
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
