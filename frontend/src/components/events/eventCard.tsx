import {
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Typography,
  Box,
  Rating,
} from '@mui/material';
import ImageHelper from '../common/image-helper';
import { Event } from '@/app/events/page';
import { Tag } from '@/types/types';
import {
  StarRounded,
  EventRounded,
  ScheduleRounded,
} from '@mui/icons-material';

type Props = {
  handleCardClick: () => void;
  event: Event;
  oldEvent?: boolean;
  alertCopyURLFn: () => void;
  weekDay: string;
  startTime: string;
  endTime: string;
  monthAndDay: string;
  laptopQuery: boolean;
  avgRating?: number;
  iconsComponent?: JSX.Element;
  tags: Tag[];
  modality: string;
};

function EventCard({
  handleCardClick,
  event,
  oldEvent,
  weekDay,
  startTime,
  endTime,
  monthAndDay,
  laptopQuery,
  avgRating,
  iconsComponent,
  tags,
  modality,
}: Props) {
  const eventId = event.id_event;

  const renderModalities = () => {
    const modalitiesColor = () => {
      if (modality === 'In Person') {
        return '#FF5733';
      } else if (modality === 'Online') {
        return '#FFD700';
      } else if (modality === 'Online & In Person') {
        return '#FFA500';
      }
    };

    return (
      <Box
        sx={{
          backgroundColor: modalitiesColor(),
          borderRadius: '5px',
          paddingTop: '0.1rem',
          paddingBottom: '0.1rem',
          paddingLeft: '0.3rem',
          paddingRight: '0.3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '0.5rem',
        }}
      >
        <Typography
          color={modality === 'Online' ? 'black' : 'white'}
          fontSize={'0.8125rem'}
          textAlign={'center'}
          fontWeight={'bold'}
        >
          {modality}
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        position: 'relative',
        width: '23.75rem',
        height: '23.5rem',
        borderRadius: '5px',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',

          display: 'flex',
          alignItems: 'start',
          justifyContent: 'start',
          zIndex: 1,
          padding: '0.5rem',
        }}
      >
        {renderModalities()}
      </Box>
      <CardMedia>
        <ImageHelper
          src={`${event.image_url_event}`}
          width='23.75rem'
          height='13.75rem'
          alt={event.name_event}
        />
      </CardMedia>
      <CardContent
        sx={{
          backgroundColor: 'rgba(51, 51, 51, 0.02)',
          paddingBottom: '0',
        }}
      >
        <Typography
          sx={{
            fontSize: '1.25rem',
            gridArea: 'title',
            fontWeight: '500',
          }}
        >
          {event.name_event.length > 32
            ? `${event.name_event.slice(0, 32)}...`
            : event.name_event}
        </Typography>
        <Box
          sx={{
            gridArea: 'date',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <EventRounded
            sx={{
              color: '#3874CB',
              fontSize: '0.8rem',
              marginRight: '0.1rem',
              fontWeight: 'bold',
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='body2' sx={{ color: '#3874CB' }}>
              {weekDay}, {monthAndDay}
            </Typography>
            <ScheduleRounded
              sx={{
                color: '#3874CB',
                fontSize: '0.8rem',
                marginRight: '0.1rem',
                fontWeight: 'bold',
                marginLeft: '0.8rem',
              }}
            />
            <Typography variant='body2' sx={{ color: '#3874CB' }}>
              {startTime} - {endTime}
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            gridArea: 'description',
            textAlign: 'justify',
            fontSize: '0.75rem',
            height: '2.3rem',
          }}
        >
          {event.description_event.length > 100
            ? `${event.description_event.slice(0, 100)}...`
            : event.description_event}
        </Typography>

        {oldEvent ? (
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '0.3rem',
              paddingLeft: '0',
            }}
          >
            <Box
              sx={{
                gridArea: 'icons',
                display: 'flex',
                justifyContent: laptopQuery ? 'flex-start' : 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {!avgRating ? (
                <Typography sx={{ fontSize: '0.8rem' }}>
                  No reviews yet
                </Typography>
              ) : (
                <Rating
                  name='read-only'
                  value={avgRating}
                  readOnly
                  precision={0.5}
                  size='small'
                  emptyIcon={<StarRounded />}
                  icon={<StarRounded />}
                  sx={{ fontSize: '1.3rem' }}
                />
              )}
            </Box>
          </CardActions>
        ) : (
          <CardActions
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '0',
              width: '100%',
              paddingLeft: '0',
            }}
          >
            <Box
              sx={{
                gridArea: 'icons',
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {iconsComponent}
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                width: '100%',
                marginBottom: '0.5rem',
              }}
            ></Box>
          </CardActions>
        )}
      </CardContent>
    </Card>
  );
}

export default EventCard;
