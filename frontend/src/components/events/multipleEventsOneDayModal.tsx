import { Event } from '@/types/pages.types';
import { Box, Modal, Typography } from '@mui/material';
import React from 'react';
import NewEventCard from './newEventCard';

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  events: Event[];
};

const MultipleEventsOneDayModal = ({ isOpen, handleClose, events }: Props) => {
  console.log('events in modal', events);
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
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
        <Box
          sx={{
            display: 'flex',
            backgroundColor: '#FBF8FF',
            columnGap: '16px',
            minWidth: '807px',
          }}
        >
          {events.map((event, index) => {
            return (
              <NewEventCard
                key={index}
                event={event}
                user={{ id: '', role: '' }}
                attending={false}
                laptopQuery={false}
              />
            );
          })}
        </Box>
      </Box>
    </Modal>
  );
};

export default MultipleEventsOneDayModal;
