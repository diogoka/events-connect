'use client';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import DetailInfo from '@/components/event/detail-info';
import {
  Box,
  Stack,
  Typography,
  Link,
  useMediaQuery,
  AlertColor,
  AlertTitle,
  Alert,
} from '@mui/material';
import DetailContainer from '@/components/event/detail-container';
import DetailIconContainer from '@/components/event/detail-icon-container';
import DetailTimeContainer from '@/components/event/detail-time-container';
import DetailButtonContainer from '@/components/event/detail-button-container';
import Review from '@/components/event/review/review';
import { UserContext } from '@/context/userContext';
import { PageContext } from '@/context/pageContext';
import ImageHelper from '@/components/common/image-helper';
import IconsContainer from '@/components/icons/iconsContainer';
import dayjs from 'dayjs';
import MapWithMarker from '@/components/map/mapWithMarker';
import {
  Attendee,
  EventDate,
  Tag,
  Event,
  OtherInfo,
  AlertState,
} from '@/types/types';

export default function EventPage() {
  const { notFound } = useContext(PageContext);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<Event>();
  const [otherInfo, setOtherInfo] = useState<OtherInfo>();
  const [applied, setApplied] = useState<boolean>(false);
  const [attendees, setAttendees] = useState<Array<Attendee>>();
  const [organizerEvent, setOrganizerEvent] = useState<boolean>(false);
  const [oldEvent, setOldEvent] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [forPreview, setForPreview] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<AlertState>({
    title: '',
    message: '',
    severity: 'success',
  });

  const params = useParams();

  const EVENT_ID = params.id;
  const laptopQuery = useMediaQuery('(max-width:769px)');

  const handleAlert = (
    isOpen: boolean,
    titleParam: string,
    messageParam: string,
    severityParam: AlertColor
  ) => {
    setAlertMessage({
      title: titleParam,
      message: messageParam,
      severity: severityParam,
    });
    setIsAlertVisible(isOpen);
  };

  const handleAlertClose = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    setIsAlertVisible(false);
  };

  const alertFn = (title: string, message: string, severity: AlertColor) => {
    return laptopQuery ? (
      <Alert
        severity={severity}
        onClose={handleAlertClose}
        variant='filled'
        sx={{
          position: 'absolute',
          width: '90%',
          top: '5rem',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999999,
        }}
      >
        <AlertTitle sx={{ color: 'white' }}>{title}</AlertTitle>
        {message}
      </Alert>
    ) : (
      <Alert
        severity={severity}
        onClose={handleAlertClose}
        variant='filled'
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999999,
        }}
      >
        <AlertTitle sx={{ color: 'white' }}>{title}</AlertTitle>
        {message}
      </Alert>
    );
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${EVENT_ID}`)
      .then((res) => {
        if (!res.data.event.id_event) {
          notFound();
          return;
        }

        setEvent({
          ...res.data.event,
          dates_event: [
            {
              date_event_start: dayjs(res.data.event.date_event_start),
              date_event_end: dayjs(res.data.event.date_event_end),
            },
          ],
        });

        setAttendees([...res.data.event.attendees]);

        setOtherInfo({
          image_event: '',
          id_event: res.data.event.id_event,
          id_owner: res.data.event.id_owner,
        });

        res.data.event.attendees.map((val: Attendee) => {
          val.id == user!.id && setApplied(true);
        });

        user?.roleName == 'organizer' &&
          user?.id == res.data.event.id_owner &&
          setOrganizerEvent(true);
        let today = new Date();
        let eventDate = new Date(res.data.event.date_event_start);
        eventDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        eventDate < today && setOldEvent(true);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error.response);
      });
  }, [applied]);

  const eventCapacity = event?.capacity_event;

  if (!otherInfo?.id_event) {
    return <></>;
  } else if (laptopQuery) {
    ///////////////////// Mobile /////////////////////
    return (
      <Stack>
        {isAlertVisible &&
          alertFn(
            alertMessage.title,
            alertMessage.message,
            alertMessage.severity
          )}

        <DetailContainer
          event={event!}
          otherInfo={otherInfo!}
          applied={applied}
          organizerEvent={organizerEvent}
          forMobile={laptopQuery}
          forPreview={forPreview}
          isAlertVisible={isAlertVisible}
          setIsAlertVisible={setIsAlertVisible}
        />
        {event && (
          <DetailInfo
            price={event.price_event}
            maxSpots={event.capacity_event}
            attendees={attendees!}
            tags={event.tags}
            category={event.category_event}
            forMobile={laptopQuery}
            forPreview={forPreview}
          />
        )}
        {oldEvent ? (
          <Review id_event={otherInfo!.id_event} applied={applied} />
        ) : (
          <DetailButtonContainer
            event={event!}
            otherInfo={otherInfo!}
            applied={applied}
            organizerEvent={organizerEvent}
            forMobile={laptopQuery}
            forPreview={forPreview}
            maxSpots={eventCapacity}
            setAttendees={setAttendees}
            setApplied={setApplied}
            handleAlertFn={handleAlert}
          />
        )}
      </Stack>
    );
  } else {
    ///////////////////// Lap Top /////////////////////

    return (
      <>
        {isAlertVisible &&
          alertFn(
            alertMessage.title,
            alertMessage.message,
            alertMessage.severity
          )}
        <Stack>
          <Box
            width='100%'
            display='flex'
            paddingTop='50px'
            justifyContent='space-between'
          >
            {/* /////////// Left /////////// */}
            <Box width='67%'>
              <DetailContainer
                event={event!}
                otherInfo={otherInfo!}
                applied={applied}
                organizerEvent={organizerEvent}
                forMobile={laptopQuery}
                forPreview={forPreview}
                isAlertVisible={isAlertVisible}
                setIsAlertVisible={setIsAlertVisible}
              />
              {event && (
                <DetailInfo
                  price={event.price_event}
                  maxSpots={event.capacity_event}
                  attendees={attendees!}
                  tags={event.tags}
                  category={event.category_event}
                  forMobile={laptopQuery}
                  forPreview={forPreview}
                />
              )}
            </Box>

            {/* /////////// Right /////////// */}
            <Box width='30%'>
              <DetailIconContainer
                event={event!}
                otherInfo={otherInfo!}
                applied={applied}
                organizerEvent={organizerEvent}
                forMobile={laptopQuery}
                forPreview={forPreview}
                setIsAlertVisible={setIsAlertVisible}
                handleAlertFn={handleAlert}
              />
              <Box overflow='hidden'>
                <ImageHelper
                  src={`${event?.image_url_event}`}
                  width='100%'
                  height='20vw'
                  style={{
                    maxHeight: '260px',
                    borderRadius: '.5rem',
                  }}
                  alt={event?.name_event ?? 'Event'}
                />
              </Box>
              <Link
                href={`https://maps.google.com/?q=${event?.location_event}`}
                target='_blank'
              >
                <Box display='flex' marginTop='20px'>
                  <IconsContainer
                    icons={[
                      {
                        name: 'FaLocationArrow',
                        isClickable: false,
                        color: 'navy',
                      },
                    ]}
                    onIconClick={() => {
                      return;
                    }}
                  />
                  <Typography>{event?.location_event}</Typography>
                </Box>
              </Link>
              <MapWithMarker location={event?.location_event ?? ''} />
            </Box>
            {/* //right */}
          </Box>
          {/* //flex */}
        </Stack>

        {oldEvent && (
          <Review id_event={otherInfo!.id_event} applied={applied} />
        )}

        {/* /////////// Footer /////////// */}
        {!oldEvent && (
          <Box
            padding='0 30px'
            left='0'
            width='100%'
            margin='0 auto'
            position='fixed'
            bottom='0'
            zIndex='201'
            style={{ backgroundColor: '#dedede' }}
          >
            <Box
              maxWidth='1280px'
              width='100%'
              paddingInline='40px'
              marginInline='auto'
              display='flex'
              justifyContent='space-between'
            >
              <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
              >
                <DetailTimeContainer
                  event={event!}
                  otherInfo={otherInfo!}
                  applied={applied}
                  organizerEvent={organizerEvent}
                  forMobile={laptopQuery}
                />
                <Box marginLeft='10px' fontWeight='bold'>
                  {event?.name_event}
                </Box>
              </Box>

              <Box width='55%'>
                <DetailButtonContainer
                  event={event!}
                  otherInfo={otherInfo!}
                  applied={applied}
                  organizerEvent={organizerEvent}
                  forMobile={laptopQuery}
                  forPreview={forPreview}
                  maxSpots={eventCapacity}
                  setApplied={setApplied}
                  setAttendees={setAttendees}
                  handleAlertFn={handleAlert}
                />
              </Box>
            </Box>
          </Box>
        )}
      </>
    );
  }
}
