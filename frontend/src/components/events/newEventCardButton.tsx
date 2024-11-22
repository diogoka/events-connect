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
  isDisabled?: boolean;
};

const CardButton = ({
  isOwner,
  isAttending,
  isPastEvent,
  handleClickButtonCard,
  isUserPage,
  isDetail = false,
  isDisabled = false,
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
              : isDetail
              ? '#4F5B92'
              : '#DDE1FF',
            color: isOwner
              ? 'black'
              : isAttending && isUserPage
              ? '#410002'
              : isDetail
              ? '#FFFFFF'
              : '#000000',
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
          disabled={
            (!isUserPage && isAttending) ||
            (isDisabled && !isAttending && !isOwner)
          }
        >
          {isOwner
            ? 'Edit'
            : isAttending && isUserPage
            ? 'Cancel'
            : isDisabled
            ? 'No spots available'
            : isDetail
            ? 'Join Event'
            : 'Join'}
        </Button>
      )}
    </>
  );
};

export default CardButton;
