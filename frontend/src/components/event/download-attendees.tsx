import React, { useState } from 'react';
import { CSVLink } from 'react-csv';

import { weekDayFn, TimeFn, monthDayFn } from '@/common/functions';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CircularProgress from '@mui/material/CircularProgress';
import { api } from '@/services/api';

import { AttendeesListType } from '@/types/components.types';
import { Box, Button, Typography } from '@mui/material';
import { useSnack } from '@/context/snackContext';

type Props = { eventId: number };

function DownloadAttendees({ eventId }: Props) {
  const [eventToDownload, setEventToDownload] = useState<Array<Array<string>>>(
    []
  );
  const [eventName, setEventName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [readyToDownload, setReadyToDownload] = useState<boolean>(false);

  const [noAttendees, setNoAttendees] = useState(false);

  const { openSnackbar } = useSnack();

  const prepareCSV = (data: AttendeesListType) => {
    const weekDay = weekDayFn(data.event.date_event_start);
    const time = TimeFn(data.event.date_event_start);
    const month = monthDayFn(data.event.date_event_start);
    const downloadCSV: any = [
      ['Event name: ', data.event.name_event],
      ['Event Location: ', data.event.location_event],
      ['Date: ', `${weekDay}, ${month}, ${time}`],
      ['First Name', 'Last Name', 'Course', 'Email', 'Student ID'],
    ];

    data.attendees.forEach((attendee) => {
      downloadCSV.push([
        attendee.first_name_user,
        attendee.last_name_user,
        attendee.users_courses,
        attendee.email_user,
        attendee.student_id_user,
      ]);
    });

    setEventToDownload(downloadCSV);
    setEventName(data.event.name_event);
    setReadyToDownload(true);
  };

  const getAttendeesList = async () => {
    try {
      const response = await api.get(`api/events/attendee/${eventId}`);
      const data = response.data;

      if (response.data.length === 0) {
        openSnackbar('There is no attendees for this event.', 'info');
        setNoAttendees(true);
      } else {
        prepareCSV({
          event: data.event,
          attendees: data.attendees,
        });
      }
    } catch (error) {
      console.error('Error fetching attendees list:', error);
    }
  };

  const handleDownloadClick = async (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.stopPropagation();
    setLoading(true);
    setReadyToDownload(false);
    await getAttendeesList();
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <CircularProgress size={24} />
      ) : noAttendees ? (
        <Box
          sx={{
            borderRadius: '6px',
            color: '#2C1229',
            padding: '8px',
            fontSize: '1rem',
            backgroundColor: '#FFD7F3',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>No attendees</Typography>
        </Box>
      ) : readyToDownload ? (
        <CSVLink
          data={eventToDownload}
          filename={`Attendees Report ${eventName}.csv`}
          className='btn btn-primary'
          target='_blank'
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: '#454B1B',
            borderRadius: '6px',
            backgroundColor: '#AFE1AF',
            fontSize: '1rem',
            padding: '8px',
          }}
          onClick={(e: any) => {
            openSnackbar('Attendees List Downloaded.', 'success');
            e.stopPropagation();
          }}
        >
          <ArrowDownwardIcon fontSize='small' />
          <Typography sx={{ fontWeight: 'bold' }}>Attendees</Typography>
        </CSVLink>
      ) : (
        <Button
          onClick={(e: any) => handleDownloadClick(e)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: '#454B1B',
            borderRadius: '6px',
            backgroundColor: '#AFE1AF',
            fontSize: '1rem',
            padding: '8px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#92C892',
            },
          }}
        >
          Get Atte. List
        </Button>
      )}
    </>
  );
}

export default DownloadAttendees;
