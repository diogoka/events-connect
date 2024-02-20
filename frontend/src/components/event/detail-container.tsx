import { useContext } from 'react';
import { Box, Typography, Link, AlertColor } from '@mui/material';
import ImageHelper from '@/components/common/image-helper';
import { Event, OtherInfo } from '@/types/types';
import IconsContainer from '../icons/iconsContainer';
import DetailIconContainer from './detail-icon-container';
import DetailTimeContainer from './detail-time-container';

export type Props = {
  event: Event;
  applied: boolean;
  organizerEvent: boolean;
  otherInfo: OtherInfo;
  forMobile: boolean;
  forPreview: boolean;
  maxSpots?: number;
  isAlertVisible?: boolean;
  setIsAlertVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAlertFn?: (
    isOpen: boolean,
    title: string,
    message: string,
    severity: AlertColor
  ) => void;
};

const DetailContainer = ({
  event,
  otherInfo,
  applied,
  organizerEvent,
  forMobile,
  forPreview,
  isAlertVisible,
  setIsAlertVisible,
}: Props) => {
  const locationContainerStyle = {
    fontSize: forMobile ? 'auto' : '1.2rem',
    marginTop: '3px',
  };
  const h1Style = !forMobile
    ? { textAlign: 'left', fontWeight: 'bold', fontSize: '2.5rem' }
    : null;
  const timeContainerStyle = { margin: forMobile ? '10px auto' : '40px auto' };

  return (
    <>
      <Typography variant='h1' sx={h1Style}>
        {event?.name_event}
      </Typography>

      <Box
        display={forMobile ? 'block' : 'none'}
        style={{ marginInline: 'auto' }}
      >
        <ImageHelper
          src={event?.image_url_event}
          width='100%'
          height='auto'
          alt={event?.name_event ?? 'Event'}
        />
      </Box>

      <Box display={forMobile ? 'block' : 'none'}>
        <DetailIconContainer
          event={event!}
          otherInfo={otherInfo!}
          applied={applied}
          organizerEvent={organizerEvent}
          forMobile={forMobile}
          forPreview={forPreview}
          setIsAlertVisible={setIsAlertVisible}
        />
      </Box>

      <Box style={timeContainerStyle}>
        <DetailTimeContainer
          event={event!}
          otherInfo={otherInfo!}
          applied={applied}
          organizerEvent={organizerEvent}
          forMobile={forMobile!}
        />

        <Link
          href={`https://maps.google.com/?q=${event?.location_event}`}
          target='_blank'
        >
          <Box display='flex' alignItems='center'>
            <IconsContainer
              icons={[
                { name: 'FaLocationArrow', isClickable: false, color: 'navy' },
              ]}
              onIconClick={() => {
                return;
              }}
            />
            <Typography sx={locationContainerStyle}>
              {event?.location_event}
            </Typography>
          </Box>
        </Link>
      </Box>

      <Box
        fontSize={forMobile ? '1em' : '1.1em'}
        margin={forMobile ? '1rem 1rem 1rem 0.5rem' : '30px auto'}
      >
        <Box fontWeight='bold'>About this event:</Box>
        <pre
          style={{
            fontFamily: 'inherit',
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}
        >
          {event?.description_event}
        </pre>
      </Box>
    </>
  );
};

export default DetailContainer;
