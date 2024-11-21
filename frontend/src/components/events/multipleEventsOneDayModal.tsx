import { AttendedEvent, Event } from '@/types/pages.types';
import { Box, Modal, Typography, IconButton } from '@mui/material';
import React, { useState } from 'react';
import NewEventCard from './newEventCard';
import Image from 'next/image';
import arrowLeftIconSvg from '../../../public/icons/arrowLeftIconSvg.svg';
import arrowRightIconSvg from '../../../public/icons/arrowRightIconSvg.svg';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  events: Event[];
  attendedEvents: AttendedEvent[] | undefined;
  user: { id: string | undefined; role: string | undefined };
};

const MultipleEventsOneDayModal = ({
  isOpen,
  handleClose,
  events,
  attendedEvents,
  user,
}: Props) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const handlePreviousEvent = () => {
    setCurrentEventIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const handleNextEvent = () => {
    setCurrentEventIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const checkAttendance = (eventId: number): boolean => {
    return attendedEvents!.some((event) => event.id_event === eventId);
  };

  const checkOwnership = (eventIdOwner: string): boolean => {
    return user.id === eventIdOwner;
  };

  const onClose = () => {
    setCurrentEventIndex(0);
    handleClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '807px',
          backgroundColor: '#FBF8FF',
          boxShadow: 24,
          p: 4,
          borderRadius: '6px',
        }}
      >
        {/* Close Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 2,
            color: '#4F5B92',
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          sx={{
            fontSize: '32px',
            fontWeight: 700,
            textAlign: 'start',
            marginBottom: '16px',
          }}
        >
          Events on this day
        </Typography>

        <Box sx={{ position: 'relative', minHeight: '300px', display: 'flex' }}>
          {/* Previous Button */}
          {events.length > 1 && (
            <Box
              sx={{
                zIndex: 2,
                backgroundColor: 'transparent',
                position: 'absolute',
                height: '75%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              component={'button'}
              onClick={handlePreviousEvent}
            >
              <Image
                src={arrowLeftIconSvg}
                alt='left arrow icon'
                width={50}
                height={50}
              />
            </Box>
          )}

          {/* Event Card */}
          <NewEventCard
            key={currentEventIndex}
            event={events[currentEventIndex]}
            user={user}
            isAttending={
              isOpen
                ? checkAttendance(events[currentEventIndex].id_event)
                : false
            }
            pastEvent={false}
            isOwner={
              isOpen
                ? checkOwnership(events[currentEventIndex].id_owner)
                : false
            }
            isUserPage={false}
            openModal={() => {}}
          />

          {/* Next Button */}
          {events.length > 1 && (
            <Box
              sx={{
                zIndex: 2,
                position: 'absolute',
                left: '92%',
                height: '75%',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'transparent',
              }}
              component={'button'}
              onClick={handleNextEvent}
            >
              <Image
                src={arrowRightIconSvg}
                alt='right arrow icon'
                width={50}
                height={50}
              />
            </Box>
          )}
        </Box>

        {/* Event Indicators */}
        {events.length > 1 && (
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
        )}
      </Box>
    </Modal>
  );
};

export default MultipleEventsOneDayModal;
