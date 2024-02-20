'use client';
import { useState, useEffect, useContext } from 'react';
import { EventContext } from '@/context/eventContext';
import { useMediaQuery, Box, Stack, Typography, Link } from '@mui/material';
import dayjs from 'dayjs'; // Remove
import DetailContainer from '@/components/event/detail-container';
import DetailInfo from '@/components/event/detail-info';
import DetailIconContainer from '@/components/event/detail-icon-container';
import ImageHelper from '@/components/common/image-helper';
import IconsContainer from '@/components/icons/iconsContainer';
import ButtonsForPreview from './button';
import { useSearchParams } from 'next/navigation';
import MapWithMarker from '@/components/map/mapWithMarker';
import alertFn from '@/components/common/alertFunction';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserContext } from '@/context/userContext';
import { storage } from '@/auth/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export interface DateRange {
  date_event_start: dayjs.Dayjs;
  date_event_end: dayjs.Dayjs;
}

type Tag = {
  id_tag: number;
  name_tag: string;
};

export type ShowAlert = {
  show: boolean;
  title: string;
  message: string;
};

export type EventData = {
  name_event: string;
  description_event: string;
  dates_event: DateRange[];
  capacity_event: number;
  location_event: string;
  price_event: number;
  tags: Tag[];
  category_event: string;
  image_url_event: string;
};

export default function PreviewEventPage() {
  const searchParams = useSearchParams();

  const {
    image,
    createdEvent,
    dispatch,
    initialState,
    pathName,
    setShowedPage,
    setImage,
  } = useContext(EventContext);
  const [tempState, setTempState] = useState<EventData>();
  const [forPreview, setForPreview] = useState<boolean>(true);
  const [eventId, setEventId] = useState<number>();
  const forMobile = useMediaQuery('(max-width: 768px)');
  const [tempImage, setTempImage] = useState('');
  const [showAlert, setShowAlert] = useState<ShowAlert>({
    show: false,
    title: '',
    message: '',
  });
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const { user } = useContext(UserContext);

  const router = useRouter();

  const uploadImage = async (image: Blob) => {
    try {
      let url = '';
      if (image != null) {
        let reference: any = '';

        const imageRef = ref(
          storage,
          `events/${createdEvent.name_event}+${uuidv4()}`
        );
        const imageToUpload = image!;

        await uploadBytes(imageRef, imageToUpload).then((response) => {
          return getDownloadURL(response.ref).then((res) => {
            return (url = res);
          });
        });
        return url;
      } else {
        return (url = `${process.env.NEXT_PUBLIC_URL_EVENT_IMAGE_DEFAULT}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const submitEventHandler = async (id: number) => {
    const url = await uploadImage(image!);

    const newEvent = {
      owner: user!.id,
      title: createdEvent.name_event,
      description: createdEvent.description_event,
      spots: createdEvent.capacity_event.toString(),
      location: createdEvent.location_event,
      price: createdEvent.price_event.toString(),
      category: createdEvent.category_event,
      imageURL: url,
    };

    const formData = new FormData();

    formData.append('owner', user!.id);
    formData.append('title', tempState!.name_event);
    formData.append('description', tempState!.description_event);
    formData.append('spots', tempState!.capacity_event.toString());
    formData.append('location', tempState!.location_event);
    formData.append('price', tempState!.price_event.toString());
    formData.append('category', tempState!.category_event);
    formData.append('imageURL', url);

    tempState!.tags.forEach((tag, key) => {
      formData.append(`tagId[${key}]`, tag.id_tag.toString());
    });

    tempState!.dates_event.forEach((date, key) => {
      formData.append(
        `dates[${key}][dateStart]`,
        date.date_event_start.toString()
      );
      formData.append(`dates[${key}][dateEnd]`, date.date_event_end.toString());
    });

    if (id > 0) {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${id}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
        .then((res) => {
          if (pathName === '/events/new/preview') {
            setShowedPage({
              label: 'Events',
              path: '/',
            });
          }
          setShowAlert({
            show: true,
            title: 'Updated',
            message: 'Event was updated successfully!',
          });
          setTimeout(() => {
            router.replace('/events');
            setShowAlert({ show: false, title: '', message: '' });
          }, 2500);
          dispatch({
            type: 'RESET',
            payload: initialState,
          });
          setImage(null);
        })
        .catch((err) => {
          // console.error('Err:',err.response.data);
          console.error('Err:', err.response);
        });
    } else {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/new`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
        .then((res) => {
          if (pathName === '/events/new/preview') {
            setShowedPage({
              label: 'Events',
              path: '/',
            });
          }
          setShowAlert({
            show: true,
            title: 'Created',
            message: 'Event was created successfully!',
          });
          setTimeout(() => {
            router.replace('/events');
            setShowAlert({ show: false, title: '', message: '' });
          }, 2500);
          dispatch({
            type: 'RESET',
            payload: initialState,
          });
          setImage(null);
        })
        .catch((err) => {
          console.error('Err:', err.response);
        });
    }
  };

  useEffect(() => {
    if (image) {
      setTempImage(URL.createObjectURL(image));
    }
  }, [image]);

  useEffect(() => {
    const newArray = createdEvent.dates.map((date) => ({
      date_event_start: date.dateStart,
      date_event_end: date.dateEnd,
    }));

    setTempState({
      name_event: createdEvent.name_event,
      description_event: createdEvent.description_event,
      dates_event: newArray,
      capacity_event: createdEvent.capacity_event,
      location_event: createdEvent.location_event,
      price_event: createdEvent.price_event,
      tags: [...createdEvent.selectedTags, createdEvent.modality],
      category_event: createdEvent.category_event,
      image_url_event: '',
    });

    setEventId(parseInt(searchParams.get('eventId')!));
  }, []);

  const onClose = () => {
    setShowAlert({ show: false, title: '', message: '' });
    router.replace('/events');
  };

  if (forMobile) {
    return (
      <Stack>
        {showAlert.show &&
          alertFn(showAlert.title, showAlert.message, 'success', onClose)}
        <Typography
          margin='30px auto 0'
          fontSize='1.3em'
          color='crimson'
          width='fit-content'
        >
          {eventId! > 0
            ? 'Event is not updated yet.'
            : 'Event is not created yet.'}
        </Typography>

        <DetailContainer
          event={tempState!}
          otherInfo={{
            image_event: '',
            id_event: NaN,
            id_owner: '',
          }}
          applied={false}
          organizerEvent={false}
          forMobile={true}
          forPreview={forPreview}
          setIsAlertVisible={setIsAlertVisible}
        />

        {tempState && (
          <DetailInfo
            price={tempState.price_event}
            maxSpots={tempState.capacity_event}
            attendees={[
              {
                id: undefined,
                firstName: '',
                lastName: '',
                course: '',
                email: '',
              },
            ]}
            tags={tempState.tags}
            category={tempState.category_event}
            forMobile={true}
            forPreview={forPreview}
          />
        )}
        <ButtonsForPreview
          forMobile={forMobile}
          eventId={eventId!}
          submitEventHandler={submitEventHandler}
        />
      </Stack>
    );
  } else {
    return (
      <Stack>
        {showAlert.show &&
          alertFn(showAlert.title, showAlert.message, 'success', onClose)}
        <Typography
          margin='40px auto 0'
          fontSize='1.3em'
          color='crimson'
          width='fit-content'
        >
          {eventId! > 0
            ? 'Event is not updated yet.'
            : 'Event is not created yet.'}
        </Typography>

        <Box
          width='100%'
          display='flex'
          paddingTop='50px'
          justifyContent='space-between'
        >
          {/* /////////// Left /////////// */}
          <Box minWidth='67%' marginRight='40px' justifyContent='space-between'>
            <DetailContainer
              event={tempState!}
              otherInfo={{
                image_event: '',
                id_event: NaN,
                id_owner: '',
              }}
              applied={false}
              organizerEvent={false}
              forMobile={forMobile!}
              forPreview={forPreview}
              setIsAlertVisible={setIsAlertVisible}
            />
            {tempState && (
              <DetailInfo
                price={tempState.price_event}
                maxSpots={tempState.capacity_event}
                attendees={[
                  {
                    id: undefined,
                    firstName: '',
                    lastName: '',
                    course: '',
                    email: '',
                  },
                ]}
                tags={tempState.tags}
                category={tempState.category_event}
                forMobile={forMobile!}
                forPreview={forPreview}
              />
            )}
          </Box>

          {/* /////////// Right /////////// */}
          <Box width='30%'>
            <DetailIconContainer
              event={tempState!}
              otherInfo={{
                image_event: '',
                id_event: NaN,
                id_owner: '',
              }}
              applied={false}
              organizerEvent={false}
              forMobile={forMobile!}
              forPreview={forPreview}
              setIsAlertVisible={setIsAlertVisible}
            />
            <Box overflow='hidden'>
              <ImageHelper
                src={tempImage}
                width='100%'
                height='20vw'
                style={{
                  maxHeight: '260px',
                  borderRadius: '.5rem',
                }}
                alt={tempState?.name_event ?? 'Event'}
              />
            </Box>

            <Link
              href={`https://maps.google.com/?q=${tempState?.location_event}`}
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
                <Typography>{tempState?.location_event}</Typography>
              </Box>
            </Link>

            <MapWithMarker location={createdEvent.location_event} />
          </Box>
          {/* //right */}
        </Box>
        {/* //flex */}
        <ButtonsForPreview
          forMobile={forMobile!}
          eventId={eventId!}
          submitEventHandler={submitEventHandler}
        />
      </Stack>
    );
  }
}
