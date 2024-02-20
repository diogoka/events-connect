import { useState, useContext } from 'react';
import { AlertColor, Box, Button, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { UserContext } from '@/context/userContext';
import { EventContext } from '@/context/eventContext';
import ModalAttendParticipation from './modal-attend-participation';
import ModalCancelParticipation from './modal-cancel-participation';
import { OtherInfo, Attendee, Event, AlertState } from '@/types/types';
import DownloadAttendees from './download-attendees';

type Props = {
  event: Event;
  otherInfo: OtherInfo;
  applied: boolean;
  organizerEvent: boolean;
  forMobile: boolean;
  maxSpots?: number;
  setApplied: React.Dispatch<React.SetStateAction<boolean>>;
  setAttendees: React.Dispatch<
    React.SetStateAction<Array<Attendee> | undefined>
  >;
  forPreview?: boolean;
  handleAlertFn: (
    isOpen: boolean,
    title: string,
    message: string,
    severity: AlertColor
  ) => void;
};

const DetailButtonContainer = ({
  event,
  otherInfo,
  applied,
  organizerEvent,
  forMobile,
  maxSpots,
  setApplied,
  setAttendees,
  handleAlertFn,
}: Props) => {
  const { loginStatus, user } = useContext(UserContext);
  const { showedPage, setShowedPage } = useContext(EventContext);
  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const laptopQuery = useMediaQuery('(max-width:769px)');

  const router = useRouter();
  const pathName = usePathname();
  const params = useParams();

  const cancelEvent = () => {
    setIsCancelModalOpen(true);
  };

  const handleAttendEvent = () => {
    if (event.price_event > 0) {
      setIsAttendModalOpen(true);
    } else {
      addAttendee();
    }
  };

  const addAttendee = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/attendee`, {
        id_event: otherInfo?.id_event,
        id_user: user?.id,
      })
      .then((res: any) => {
        handleAlertFn(
          true,
          'Success',
          'You have successfully applied to this event',
          'success'
        );
        setTimeout(() => {
          handleAlertFn(false, '', '', 'success');
        }, 3000);
        setApplied(true);

        setAttendees((prev) => {
          return prev?.concat(res.data[0]);
        });
      });
  };

  const editEventHandler = (id: number) => {
    if (!id) {
      //generate an alert here instead of console
    } else {
      if (pathName === `/events/${params.id}`) {
        setShowedPage({
          label: 'Create Event',
          path: '/events/new',
        });
      }

      router.push(`/events/${id}/edit`);
    }
  };

  const deleteEvent = (id: number) => {
    setIsCancelModalOpen(true);
  };

  const margin = {
    marginBlock: forMobile ? '25px' : '15px',
    '&:disabled': {
      backgroundColor: '#f14c4c',
      color: '#fff',
    },
  };

  const closeAttendModal = () => setIsAttendModalOpen(false);
  const closeCancelModal = () => setIsCancelModalOpen(false);
  const id_event = otherInfo?.id_event;
  const id_user = user?.id;

  return (
    <>
      <Box
        justifyContent={laptopQuery ? 'space-evenly' : 'space-between'}
        display={organizerEvent && loginStatus == 'Logged In' ? 'flex' : 'none'}
        sx={{ ...margin, columnGap: !laptopQuery ? '' : '1rem' }}
      >
        {!laptopQuery && (
          <Box style={{ width: '37%' }}>
            {otherInfo?.id_event && <DownloadAttendees eventData={event} />}
          </Box>
        )}
        <Box style={{ width: laptopQuery ? '47%' : '27%' }}>
          {otherInfo?.id_event ? (
            <Button
              type='submit'
              variant='outlined'
              color='primary'
              fullWidth
              onClick={() => editEventHandler(otherInfo.id_event)}
            >
              Edit Event
            </Button>
          ) : (
            <Box>Id is not found</Box>
          )}
        </Box>

        <Box style={{ width: laptopQuery ? '47%' : '27%' }}>
          {otherInfo?.id_event ? (
            <Button
              type='submit'
              variant='outlined'
              color='error'
              fullWidth
              onClick={() => deleteEvent(otherInfo.id_event)}
            >
              Delete Event
            </Button>
          ) : (
            <Box>Id is not found</Box>
          )}
        </Box>
      </Box>

      <Button
        style={{
          display:
            !organizerEvent && loginStatus == 'Logged In' ? 'block' : 'none',
          marginLeft: 'auto',
          width: forMobile ? '100%' : '70%',
        }}
        type='submit'
        variant={applied ? 'outlined' : 'contained'}
        color={applied ? 'error' : 'primary'}
        sx={margin}
        onClick={() => {
          applied ? cancelEvent() : handleAttendEvent();
        }}
        disabled={maxSpots! === 0 && !applied}
      >
        {applied ? 'Cancel' : maxSpots! === 0 ? 'No spot available' : 'Apply'}
      </Button>

      <Button
        style={{
          display: loginStatus !== 'Logged In' ? 'block' : 'none',
          marginLeft: 'auto',
          width: forMobile ? '100%' : '70%',
        }}
        type='submit'
        variant='contained'
        color='primary'
        sx={margin}
        onClick={() => {
          router.replace('/login/');
        }}
      >
        {'Log in to apply'}
      </Button>

      <ModalAttendParticipation
        isOpen={isAttendModalOpen}
        onClose={closeAttendModal}
        laptopQuery={laptopQuery}
        addAttendee={addAttendee}
      />

      <ModalCancelParticipation
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        laptopQuery={laptopQuery}
        setApplied={setApplied}
        setAttendees={setAttendees}
        id_event={id_event}
        id_user={id_user}
        organizerEvent={organizerEvent}
        handleAlertFn={handleAlertFn}
      />
    </>
  );
};

export default DetailButtonContainer;
