import { Box, Typography, Rating } from '@mui/material';
import ImageHelper from '../common/image-helper';
import { AiFillClockCircle } from 'react-icons/ai';
import { Event } from '@/app/events/page';
import { Tag } from '@/types/types';
import { StarRounded } from '@mui/icons-material';

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

function EventLine({
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
  const BoxStyle = {
    display: 'grid',
    gridTemplateRows: '2.5rem 2.3rem 2rem',
    gridTemplateAreas: `
        "title picture"
        "date picture"
        "description icons"
    `,
    columnGap: '1rem',
    height: '7.5rem',
    alignContent: 'center',
    borderTop: '1px solid #E0E0E0',
    cursor: 'pointer',
    marginTop: '0',
    width: '100%',
    position: 'relative',
  };

  const titleStyle = {
    fontSize: '1rem',
    gridArea: 'title',
    fontWeight: '500',
  };

  const dateContainerStyle = {
    gridArea: 'date',
    color: '#3874CB',
  };

  const dayMonthStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  };

  const timeStyle = {
    fontSize: 11,
    color: '#3874CB',
  };

  const descriptionStyle = {
    fontSize: 10,
    gridArea: 'description',
    textAlign: 'justify',
    width: '11.1875rem',
  };

  const imageContainerStyle = {
    gridArea: 'picture',
    borderRadius: '5px',
    position: 'relative',
  };

  const modalitiesContainerStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '0.3rem',
    marginRight: '0.1rem',
  };

  const iconContainerStyle = {
    gridArea: 'icons',
    display: 'flex',
    justifyContent: laptopQuery ? 'flex-start' : 'center',
    alignItems: 'center',
    width: '100%',
  };

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
        }}
      >
        <Typography
          color={modality === 'Online' ? 'black' : 'white'}
          fontSize={'0.5rem'}
          textAlign={'center'}
          fontWeight={'bold'}
        >
          {modality}
        </Typography>
      </Box>
    );
  };

  return (
    <Box onClick={handleCardClick} sx={BoxStyle}>
      <Typography sx={titleStyle}>
        {event.name_event.length > 15
          ? `${event.name_event.slice(0, 18)}...`
          : event.name_event}
      </Typography>
      <Box sx={dateContainerStyle}>
        <Box sx={dayMonthStyle}>
          <AiFillClockCircle style={{ fontSize: 11 }} />
          <Typography sx={{ fontSize: 12, color: '#3874CB' }}>
            {weekDay}, {monthAndDay}
          </Typography>
        </Box>
        <Box>
          <Typography sx={timeStyle}>
            {startTime} - {endTime}
          </Typography>
        </Box>
      </Box>

      <Typography sx={descriptionStyle}>
        {event.description_event.length > 50
          ? `${event.description_event.slice(0, 50)}...`
          : event.description_event}
      </Typography>
      <ImageHelper
        src={`${event.image_url_event}`}
        width='6.25rem'
        height='4.0625rem'
        style={imageContainerStyle}
        alt={event.name_event}
      />
      <Box sx={modalitiesContainerStyle}>{renderModalities()}</Box>

      {oldEvent ? (
        <Box sx={iconContainerStyle}>
          {avgRating ? (
            <Rating
              name='read-only'
              value={avgRating}
              readOnly
              precision={0.5}
              size='small'
              emptyIcon={<StarRounded sx={{ fontSize: '1.125rem' }} />}
              icon={<StarRounded sx={{ fontSize: '1.125rem' }} />}
            />
          ) : (
            <Typography sx={{ fontSize: '0.7rem' }}>No reviews yet</Typography>
          )}
        </Box>
      ) : (
        <Box sx={iconContainerStyle}>{iconsComponent}</Box>
      )}
    </Box>
  );
}

export default EventLine;
