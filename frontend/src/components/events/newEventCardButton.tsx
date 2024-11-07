import React from 'react';
import { Button } from '@mui/material';

import startIcon from '../../../public/icons/rateStar.svg';
import Image from 'next/image';

type Props = {
  isOwner: boolean;
  isAttending: boolean;
  isPastEvent: boolean;
  handleClickCard: () => void;
};

const CardButton = ({
  isOwner,
  isAttending,
  isPastEvent,
  handleClickCard,
}: Props) => {
  return (
    <>
      {isPastEvent ? (
        <Button
          sx={{
            borderRadius: '6px',
            padding: '8px',
            fontSize: '1rem',
            backgroundColor: isOwner ? '#AFE1AF' : '#FFD7F3',
            color: isOwner ? '#454B1B' : '#2C1229',
            '&:hover': {
              backgroundColor: isOwner ? '#92C892' : '#FFB8E1',
            },
            '&:disabled': {
              cursor: 'not-allowed',
            },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '3px',
            lineHeight: '0',
          }}
          disabled={!isAttending}
        >
          {!isOwner && isAttending && (
            <Image src={startIcon} alt='rate icon' width={16} height={16} />
          )}
          {isOwner ? 'D Attendees' : isAttending ? 'Rate' : 'Join'}
        </Button>
      ) : (
        <Button
          sx={{
            borderRadius: '6px',
            padding: '8px',
            fontSize: '1rem',
            backgroundColor: isOwner
              ? '#FFFAA0'
              : isAttending
              ? '#FFDAD6'
              : '#DDE1FF',
            color: isOwner ? '#DAA520' : isAttending ? '#410002' : 'inherit',
            '&:hover': {
              backgroundColor: isOwner
                ? '#FFD700'
                : isAttending
                ? '#FFB6B3'
                : '#B8C1FF',
            },
          }}
        >
          {isOwner ? 'Edit' : isAttending ? 'Cancel' : 'Join'}
        </Button>
      )}
    </>
  );
};

export default CardButton;
