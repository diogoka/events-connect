import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { EventContext, initialState } from '@/context/eventContext';
import { Box, Stack, Button, useMediaQuery, Grid } from '@mui/material';
import useUploadImage from '@/services/imageInput';
import BasicInfo from './basic-info/basicInfo';
import DateList from './dateSchedule/dateList';
import DetailList from './detail-info/detailList';
import Location from './location/location';
import ImageContainer from '../newEvents/basic-info/imageContainer';

export default function EventsControl({ eventId }: { eventId: number }) {
  const router = useRouter();
  const { image, setImage, createdEvent, dispatch } = useContext(EventContext);
  const [tempImage, setTempImage] = useState('');
  const isMobile = useMediaQuery('(max-width:768px)');
  const [checkedTime, setCheckedTime] = useState(false);

  const {
    image: inputImage,
    warning,
    onFileInputChange,
  } = useUploadImage(20, 10, 480);

  useEffect(() => {
    if (inputImage) {
      setImage(inputImage);
    }
  }, [inputImage]);

  useEffect(() => {
    if (image) {
      setTempImage(URL.createObjectURL(image));
    }
  }, [image]);

  useEffect(() => {
    createdEvent.dates.some((date) => {
      if (date.dateEnd.isBefore(date.dateStart, 'minute')) {
        setCheckedTime(true);
      } else {
        setCheckedTime(false);
      }
    });
  }, [createdEvent.dates]);

  const clickHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!createdEvent.name_event) {
      alert('Please enter a title');
      return;
    } else if (createdEvent.name_event.length > 32) {
      alert('Your title is too long');
      return;
    } else if (!createdEvent.description_event) {
      alert('Please enter a description');
      return;
    } else if (createdEvent.description_event.length > 500) {
      alert('Your description is too long');
      return;
    } else if (!createdEvent.dates) {
      alert('Please choose dates');
      return;
    } else if (checkedTime === true) {
      alert('Please choose correct time');
      return;
    } else if (!createdEvent.location_event) {
      alert('Please enter a location');
      return;
    } else if (!createdEvent.modality) {
      alert('Please choose a modality');
      return;
    } else if (createdEvent.price_event < 0) {
      alert('Please choose price');
      return;
    } else if (!createdEvent.capacity_event) {
      alert('Please choose spots');
      return;
    } else if (!createdEvent.category_event) {
      alert('Please choose a category');
      return;
    } else if (createdEvent.selectedTags.length <= 0) {
      alert('Please choose tags');
      return;
    } else {
      router.push(`/events/new/preview/?eventId=${eventId}`);
    }
  };

  const cancelHandler = () => {
    dispatch({ type: 'RESET', payload: initialState });
    setImage(null);
    router.push('/');
  };

  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='center'
      spacing={{ sm: 2, md: 3 }}
      component={'form'}
      onSubmit={clickHandler}
      maxWidth='869px'
      sx={{ margin: '4rem auto 0' }}
    >
      <BasicInfo isMobile={isMobile} />
      <DateList
        isMobile={isMobile}
        dates={createdEvent.dates}
        setDates={(dates) =>
          dispatch({
            type: 'UPDATE_DATES',
            payload: { ...createdEvent, dates },
          })
        }
      />
      <Location
        location={createdEvent.location_event}
        setLocation={(location) =>
          dispatch({
            type: 'UPDATE_LOCATION',
            payload: { ...createdEvent, location_event: location },
          })
        }
      />
      <DetailList
        isMobile={isMobile}
        category={createdEvent.category_event}
        setCategory={(category) =>
          dispatch({
            type: 'UPDATE_CATEGORY',
            payload: { ...createdEvent, category_event: category },
          })
        }
        selectedTags={createdEvent.selectedTags}
        setSelectedTags={(selectedTags) =>
          dispatch({
            type: 'UPDATE_SELECTED_TAGS',
            payload: { ...createdEvent, selectedTags },
          })
        }
      />
      <ImageContainer
        warning={warning}
        onFileInputChange={onFileInputChange}
        isMobile={isMobile}
        tempImage={tempImage}
        imageURL={createdEvent.image_event}
      />
      <Box sx={{ width: '100%' }}>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          rowSpacing={{ sm: 2, md: 3 }}
          columnSpacing={{ md: 2 }}
          sx={{ width: '100%' }}
        >
          <Grid item sm={12} md={6}>
            <Button
              onClick={cancelHandler}
              variant='outlined'
              color='error'
              fullWidth
            >
              Cancel
            </Button>
          </Grid>
          <Grid item sm={12} md={6}>
            <Button type='submit' variant='contained' color='primary' fullWidth>
              Preview
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
