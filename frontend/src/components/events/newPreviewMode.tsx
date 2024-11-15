import React, { useContext, useState } from 'react';
import Image from 'next/image';
import { EventContext } from '@/context/eventContext';
import {
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { monthDayFn, TimeFn } from '@/common/functions';

import calendarIconDetailSvg from '../../../public/icons/calendarIconSvgDetail.svg';
import scheduleIconSvgDetail from '../../../public/icons/scheduleIconSvgDetail.svg';
import groupIconSvg from '../../../public/icons/groupIconSvg.svg';
import nearMeIconSvg from '../../../public/icons/nearMeIconSvg.svg';
import MapWithMarker from '../map/mapWithMarker';
import { api } from '@/services/api';
import { uploadImage } from '@/services/imageUpload';

import { useSnack } from '@/context/snackContext';
import ThreeDots from '../animation/theeDots';

import { useRouter } from 'next/navigation';

type Props = {
  setToForm: () => void;
  ownerId: string;
};

const NewPreviewMode = ({ setToForm, ownerId }: Props) => {
  const { createdEvent, image, dispatch, initialState } =
    useContext(EventContext);

  const laptopQuery = useMediaQuery('(max-width:769px)');

  const monthAndDay = monthDayFn(createdEvent.dates[0].dateStart.toString());
  const startTime = TimeFn(createdEvent.dates[0].dateStart.toString());
  const endTime = TimeFn(createdEvent.dates[0].dateEnd.toString());

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { openSnackbar } = useSnack();

  const router = useRouter();

  const createNewEvent = async (e: React.MouseEvent) => {
    e.preventDefault();

    const {
      selectedTags,
      modality,
      dates,
      name_event,
      price_event,
      capacity_event,
      event_id,
      ...rest
    } = createdEvent;
    const dateStart = dates[0].dateStart.toISOString();
    const dateEnd = dates[0].dateEnd.toISOString();

    try {
      setIsLoading(true);

      if (event_id) {
        let url = '';
        if (image) {
          url = await uploadImage(image!, createdEvent.name_event);
        }

        const response = await api.patch(`api/events/${event_id}`, {
          id_owner: ownerId,
          name_event,
          ...rest,
          image_event: url ? url : createdEvent.image_event,
          price_event: +price_event,
          capacity_event: +capacity_event,
          tags: [
            ...selectedTags,
            { id_tag: modality.id_tag, name_tag: modality.name_tag },
          ],
          date_event_start: new Date(dateStart),
          date_event_end: new Date(dateEnd),
        });
        openSnackbar(`${response.data.message}`, 'success');
      } else {
        const url = await uploadImage(image!, createdEvent.name_event);
        const response = await api.post('api/events/new', {
          id_owner: ownerId,
          name_event,
          ...rest,
          image_event: url,

          price_event: +price_event,
          capacity_event: +capacity_event,
          tags: [
            ...selectedTags,
            { id_tag: modality.id_tag, name_tag: modality.name_tag },
          ],
          date_event_start: new Date(dateStart),
          date_event_end: new Date(dateEnd),
        });
        openSnackbar(`${response.data.message}`, 'success');
      }

      setTimeout(() => {
        dispatch({
          type: 'RESET',
          payload: initialState,
        });

        openSnackbar('Redirecting', 'info');
        router.push('/events');
      }, 3500);
    } catch (error: any) {
      openSnackbar(`${error}`, 'error');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack rowGap={'40px'}>
        <Box
          sx={{
            minWidth: '100%',
            minHeight: '208px',
            borderRadius: '4px',
          }}
        >
          <Image
            src={
              createdEvent.image_event.length > 0
                ? createdEvent.image_event
                : URL.createObjectURL(image!)
            }
            alt='image'
            width={380}
            height={220}
            style={{
              objectFit: 'cover',
              objectPosition: 'top',
              width: '100%',
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{ fontSize: '36px', fontWeight: 700, textAlign: 'center' }}
          >
            {createdEvent.name_event}
          </Typography>
        </Box>

        <Stack gap={1} padding={laptopQuery ? '0 30px' : '0'}>
          <Box sx={{ width: '100%', display: 'flex', gap: '8px' }}>
            <Box
              sx={{
                width: '50%',
                backgroundColor: '#F5F2FA',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                gap: '8px',
              }}
            >
              <Image
                src={calendarIconDetailSvg}
                alt='calendar icon'
                height={24}
                width={24}
              />

              <Typography sx={{ fontSize: '18px' }}>{monthAndDay}</Typography>
            </Box>
            <Box
              sx={{
                width: '50%',
                backgroundColor: '#F5F2FA',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                gap: '8px',
              }}
            >
              <Image
                src={scheduleIconSvgDetail}
                alt='schedule icon'
                height={24}
                width={24}
              />
              <Typography sx={{ fontSize: '18px' }}>
                {startTime.replace(/\s+/g, '')} to {endTime.replace(/\s+/g, '')}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: '100%',
              backgroundColor: '#F5F2FA',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              gap: '8px',
            }}
          >
            <Image
              src={nearMeIconSvg}
              alt='near me icon'
              width={24}
              height={24}
            />
            <Typography
              component='a'
              sx={{
                textDecoration: 'underline',
                fontSize: '18px',
                cursor: 'pointer',
              }}
              href={`https://maps.google.com/?q=${createdEvent.location_event}`}
              target='_blank'
            >
              {createdEvent.location_event}
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              backgroundColor: '#F5F2FA',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Image
                src={groupIconSvg}
                alt='group icon'
                width={24}
                height={24}
              />

              <Typography sx={{ fontSize: '18px' }}>
                No Attendees yet
              </Typography>
            </Box>
          </Box>
        </Stack>

        <Box sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: '18px' }}>
            <pre
              style={{
                fontFamily: 'inherit',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
              dangerouslySetInnerHTML={{
                __html: createdEvent.description_event || '',
              }}
            />
          </Typography>
        </Box>
        <Stack gap={'16px'} sx={{ marginBottom: '150px' }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 700 }}>
            Activity Location
          </Typography>
          <Box sx={{ width: '100%' }}>
            <MapWithMarker location={createdEvent.location_event!} />
          </Box>

          <Box sx={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '18px' }}>Tags</Typography>

            <Box sx={{ display: 'flex', gap: '12px' }}>
              {createdEvent.selectedTags.map(({ name_tag }, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#DFE1F9',
                    padding: '8px',
                    borderRadius: '6px',
                    maxWidth: 'fit-content',
                  }}
                >
                  <Typography sx={{ fontSize: '18x', fontWeight: 500 }}>
                    {name_tag}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '18px' }}>Categories</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#DFE1F9',
                padding: '8px',
                borderRadius: '6px',
                maxWidth: 'fit-content',
              }}
            >
              <Typography sx={{ fontSize: '18x', fontWeight: 500 }}>
                {createdEvent.category_event}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Stack>

      <Box
        padding={laptopQuery ? '0 30px' : '0 104px'}
        left='0'
        width='100%'
        margin='0 auto'
        position='fixed'
        bottom='0'
        zIndex='201'
        style={{ backgroundColor: '#DFE1F9' }}
      >
        <Box
          sx={{
            maxWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            {isLoading ? (
              <Skeleton
                width={82}
                height={60}
                animation={'wave'}
                variant='text'
              />
            ) : (
              <>
                <Typography sx={{ fontSize: '40px', fontWeight: 700 }}>
                  {createdEvent.price_event <= 0
                    ? 'Free'
                    : `$${createdEvent.price_event}/`}
                </Typography>
                {createdEvent.price_event > 0 && (
                  <Typography sx={{ fontSize: '16px' }}>person</Typography>
                )}
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: '18px' }}>
            {isLoading ? (
              <Box
                sx={{
                  minWidth: '200px',
                  minHeight: '48px',
                  backgroundColor: '#4F5B92',
                  color: '#FFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  gap: '6px',
                }}
              >
                Creating
                <ThreeDots color='#FFFF' />
              </Box>
            ) : (
              <>
                <Button
                  sx={{
                    borderRadius: '6px',
                    padding: '24px',
                    fontSize: '16px',
                    backgroundColor: '#F0E68C',
                    color: '#333',
                    '&:hover': {
                      backgroundColor: '#BDB76B',
                    },
                  }}
                  onClick={() => {
                    setToForm();
                  }}
                >
                  Edit
                </Button>
                <Button
                  sx={{
                    borderRadius: '6px',
                    padding: '24px',
                    fontSize: '16px',
                    backgroundColor: '#90EE90',
                    color: '#333',
                    '&:hover': {
                      backgroundColor: '#32CD32',
                    },
                  }}
                  onClick={(e) => {
                    createNewEvent(e);
                  }}
                >
                  Publish
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NewPreviewMode;
