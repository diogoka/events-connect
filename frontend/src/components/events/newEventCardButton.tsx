import React from 'react';
import { Button } from '@mui/material';

import startIcon from '../../../public/icons/rateStar.svg';
import Image from 'next/image';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

type Props = {
  isOwner: boolean;
  isAttending: boolean;
  isPastEvent: boolean;
  handleClickButtonCard: (e: React.MouseEvent) => void;
  isUserPage: boolean;
  isDetail?: boolean;
};

const CardButton = ({
  isOwner,
  isAttending,
  isPastEvent,
  handleClickButtonCard,
  isUserPage,
  isDetail = false,
}: Props) => {
  return (
    <>
      {isPastEvent ? (
        <Button
          sx={{
            borderRadius: '6px',
            padding: isDetail ? '24px' : '8px',
            fontSize: isDetail ? '16px' : '1rem',
            backgroundColor: isOwner ? '#AFE1AF' : '#FFD7F3',
            color: isOwner ? '#454B1B' : '#2C1229',
            '&:hover': {
              backgroundColor: isOwner ? '#92C892' : '#FFB8E1',
            },
            '&.Mui-disabled': {
              backgroundColor: '#F0F0F0',
              color: '#A0A0A0',
              cursor: 'not-allowed',
              '&:hover': {
                backgroundColor: '#F0F0F0',
                pointerEvents: 'none',
              },
            },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '3px',
            lineHeight: '0',
          }}
          disabled={!isAttending && !isOwner}
          onClick={(e) => handleClickButtonCard(e)}
        >
          {!isOwner && isAttending && (
            <Image src={startIcon} alt='rate icon' width={16} height={16} />
          )}
          {isOwner && <ArrowDownwardIcon fontSize='small' />}
          {isOwner ? 'Attendees' : isAttending ? 'Rate' : 'Join'}
        </Button>
      ) : (
        <Button
          sx={{
            borderRadius: '6px',
            padding: isDetail ? '24px' : '8px',
            fontSize: isDetail ? '16px' : '1rem',
            backgroundColor: isOwner
              ? '#FFFAA0'
              : isAttending && isUserPage
              ? '#FFDAD6'
              : '#4F5B92',
            color: isOwner
              ? 'black'
              : isAttending && isUserPage
              ? '#410002'
              : '#FFFF',
            '&:hover': {
              backgroundColor: isOwner
                ? '#FFD700'
                : isAttending
                ? '#FFB6B3'
                : '#B8C1FF',
            },
            '&.Mui-disabled': {
              backgroundColor: '#F0F0F0',
              color: '#A0A0A0',
              cursor: 'not-allowed',
              '&:hover': {
                backgroundColor: '#F0F0F0',
                pointerEvents: 'none',
              },
            },
          }}
          onClick={(e) => handleClickButtonCard(e)}
          disabled={!isUserPage && isAttending}
        >
          {isOwner ? 'Edit' : isAttending && isUserPage ? 'Cancel' : 'Join'}
        </Button>
      )}
    </>
  );
};

export default CardButton;
