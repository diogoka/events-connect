import React from 'react';
import { useContext } from 'react';
import IconsContainer from '../icons/iconsContainer';
import { AlertColor, Box, Rating, Typography } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { EventContext } from '@/context/eventContext';
import { StarRounded } from '@mui/icons-material';
import DownloadAttendees from '@/components/event/download-attendees';

type Props = {
  role?: string;
  userId?: string;
  owner: string;
  laptopQuery: boolean;
  eventId: number;
  attending: boolean;
  setModalOpen: (isOpen: boolean) => void;
  handleAlertFn: (
    isOpen: boolean,
    title: string,
    message: string,
    severity: AlertColor
  ) => void;
  averageRating?: number;
  oldEvent?: boolean;
};

function EventIcons({
  role,
  userId,
  owner,
  laptopQuery,
  eventId,
  attending,
  setModalOpen,
  handleAlertFn,
  averageRating,
  oldEvent,
}: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const { setShowedPage } = useContext(EventContext);

  const handleOrganizerClick = (iconName: string) => {
    if (iconName === 'FaEdit') {
      if (pathName === '/events' || 'organizer-events') {
        setShowedPage({
          label: 'Create Event',
          path: '/events/new',
        });
      }

      router.push(`/events/${eventId}/edit`);
    } else if (iconName === 'FaTrashAlt') {
      openDeleteModal();
    }
  };

  const openDeleteModal = () => {
    setModalOpen(true);
  };

  const handleUserClick = (iconName: string) => {
    if (iconName === 'FaShareSquare') {
      const currentURL = window.location.href;
      copyToClipboard(`${currentURL}/${eventId}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        handleAlertFn(
          true,
          'URL Copied',
          'The event URL has been copied to your clipboard.',
          'success'
        );
        setTimeout(() => {
          handleAlertFn(false, '', '', 'success');
        }, 3000);
      })
      .catch((err) => {
        handleAlertFn(true, 'Failed to copy URL', 'Please try again.', 'error');
        setTimeout(() => {
          handleAlertFn(false, '', '', 'error');
        }, 3000);
      });
  };

  const renderIcons = () => {
    if (role === 'organizer' && userId === owner) {
      return (
        <>
          {oldEvent ? (
            <>
              {' '}
              {!averageRating ? (
                <Typography sx={{ fontSize: '0.8rem' }}>
                  No reviews yet
                </Typography>
              ) : (
                <Rating
                  name='read-only'
                  value={averageRating}
                  readOnly
                  precision={0.5}
                  size='small'
                  emptyIcon={<StarRounded />}
                  icon={<StarRounded />}
                  sx={{ fontSize: '1.3rem' }}
                />
              )}
            </>
          ) : (
            <>
              <IconsContainer
                icons={[
                  {
                    name: 'FaEdit',
                    isClickable: true,
                    color: '#3874CB',
                    title: laptopQuery ? 'Edit' : '',
                    hoverColor: '#d7e3f4',
                  },
                  {
                    name: 'FaTrashAlt',
                    isClickable: true,
                    color: '#D00000',
                    title: laptopQuery ? 'Delete' : '',
                    hoverColor: '#ffd0d0',
                  },
                ]}
                onIconClick={handleOrganizerClick}
              />
            </>
          )}
        </>
      );
    } else {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: attending ? '#4CAF50' : 'rgb(20, 29, 79)',
              borderRadius: '5px',
              paddingTop: '0.1rem',
              paddingBottom: '0.1rem',
              paddingLeft: '0.3rem',
              paddingRight: '0.3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.5rem',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: attending ? '#4CAF50' : 'rgb(20, 29, 79, 0.8)',
              },
            }}
          >
            <Typography
              color='white'
              fontSize={'0.8125rem'}
              width={'3.48rem'}
              textAlign={'center'}
            >
              {attending ? 'Applied' : 'Join Now'}
            </Typography>
          </Box>
          <IconsContainer
            icons={[
              {
                name: 'FaShareSquare',
                isClickable: true,
                color: '#333333',
                hoverColor: '#e4e4e4',
                size: '1.24rem',
              },
            ]}
            onIconClick={handleUserClick}
          />
        </Box>
      );
    }
  };

  return renderIcons();
}

export default EventIcons;
