'use client';
import { Event } from '@/app/events/page';
import { Tag } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AlertTitle, Alert, useMediaQuery, AlertColor } from '@mui/material';
import ModalDelete from './modalDelete';
import axios from 'axios';
import {
  weekDayFn,
  TimeFn,
  monthDayFn,
  averageRatingFn,
} from '@/common/functions';
import EventCard from './eventCard';
import EventLine from './eventLine';
import EventIcons from './eventIcons';
import alertFn from '@/components/common/alertFunction';

type Props = {
  event: Event;
  tags: Tag[];
  deleteEvent: (id: number) => void;
  user: {
    id: string | undefined;
    role: string | undefined;
  };
  attending: boolean;
  oldEvent?: boolean;
  page?: number;
};

interface AlertState {
  title: string;
  message: string;
  severity: AlertColor;
}

function EventItem({
  event,
  tags,
  user,
  deleteEvent,
  attending,
  oldEvent,
  page,
}: Props) {
  const router = useRouter();
  const weekDay = weekDayFn(event.date_event_start);
  const startTime = TimeFn(event.date_event_start);
  const endTime = TimeFn(event.date_event_end);
  const monthAndDay = monthDayFn(event.date_event_start);
  const eventId = event?.id_event;
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const laptopQuery = useMediaQuery('(min-width:769px)');

  const [alertMessage, setAlertMessage] = useState<AlertState>({
    title: '',
    message: '',
    severity: 'success',
  });

  const [modality, setModality] = useState('');

  useEffect(() => {
    getAverageRating();
    checkModalities();
  });

  const getAverageRating = async () => {
    if (oldEvent) {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/reviews/${eventId}`
        )
        .then((res) => {
          setAvgRating(averageRatingFn(res.data.reviews));
        });
    }
  };

  const checkModalities = () => {
    tags.map((tag) => {
      if (tag.name_tag === 'In Person') {
        setModality('In Person');
      }
      if (tag.name_tag === 'Online') {
        setModality('Online');
      }
      if (tag.name_tag === 'Online and In Person') {
        setModality('Online & In Person');
      }
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
  const handleCardClick = () => router.push(`/events/${eventId}`);

  const handleAlertClose = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    setIsAlertVisible(false);
  };

  const checkIsOld = () => {
    if (new Date(event.date_event_end) < new Date()) {
      return true;
    } else {
      return false;
    }
  };

  const alertCopyURLFn = () => {
    return (
      <Alert
        severity='success'
        onClose={handleAlertClose}
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 9999,
        }}
      >
        <AlertTitle>URL Copied</AlertTitle>
        The event URL has been copied to your clipboard.
      </Alert>
    );
  };

  const EventIcon = (
    <EventIcons
      role={user.role}
      userId={user.id}
      owner={event.id_owner}
      laptopQuery={laptopQuery}
      eventId={event.id_event}
      attending={attending}
      setModalOpen={openModal}
      handleAlertFn={handleAlert}
      averageRating={avgRating}
      oldEvent={checkIsOld()}
    />
  );

  const renderEventItem = () => {
    if (laptopQuery) {
      return (
        <>
          <EventCard
            event={event}
            tags={tags}
            oldEvent={oldEvent}
            avgRating={avgRating}
            iconsComponent={EventIcon}
            handleCardClick={handleCardClick}
            alertCopyURLFn={alertCopyURLFn}
            weekDay={weekDay}
            monthAndDay={monthAndDay}
            startTime={startTime}
            endTime={endTime}
            laptopQuery={laptopQuery}
            modality={modality}
          />
          {isAlertVisible &&
            alertFn(
              alertMessage.title,
              alertMessage.message,
              alertMessage.severity,
              handleAlertClose
            )}
          <ModalDelete
            eventId={eventId}
            eventName={event.name_event}
            isOpen={isModalOpen}
            onClose={closeModal}
            deleteEvent={deleteEvent}
            laptopQuery={laptopQuery}
            handleAlertFn={handleAlert}
          />
        </>
      );
    } else {
      return (
        <>
          <EventLine
            event={event}
            tags={tags}
            oldEvent={oldEvent}
            avgRating={avgRating}
            iconsComponent={EventIcon}
            handleCardClick={handleCardClick}
            alertCopyURLFn={alertCopyURLFn}
            weekDay={weekDay}
            monthAndDay={monthAndDay}
            startTime={startTime}
            endTime={endTime}
            laptopQuery={laptopQuery}
            modality={modality}
          />
          {isAlertVisible &&
            alertFn(
              alertMessage.title,
              alertMessage.message,
              alertMessage.severity,
              handleAlertClose
            )}
          <ModalDelete
            eventId={eventId}
            eventName={event.name_event}
            isOpen={isModalOpen}
            onClose={closeModal}
            deleteEvent={deleteEvent}
            laptopQuery={laptopQuery}
            handleAlertFn={handleAlert}
          />
        </>
      );
    }
  };

  return renderEventItem();
}

export default EventItem;
