import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Event } from '@/types/types';
import { weekDayFn, TimeFn, monthDayFn } from '@/common/functions';

type Props = {
  eventData?: Event;
};

function DownloadAttendees({ eventData }: Props) {
  const [download, setDownload] = useState(false);
  const [eventToDownload, setEventToDownload] = useState<Array<Array<string>>>(
    []
  );
  const [eventName, setEventName] = useState(
    eventData ? eventData.name_event : ''
  );

  const linesCSV = async (data: Event) => {
    const weekDay = weekDayFn(data.date_event_start!);
    const time = TimeFn(data.date_event_start!);
    const month = monthDayFn(data.date_event_start!);

    const newDataArray: any = [
      ['Event name: ', data.name_event],
      ['Event Location: ', data.location_event],
      ['Date: ', `${weekDay}, ${month}, ${time}`],
      ['First Name', 'Last Name', 'Course', 'Email'],
    ];

    await data.attendees?.forEach((attendee) => {
      newDataArray.push([
        attendee.firstName,
        attendee.lastName,
        attendee.course,
        attendee.email,
      ]);
    });

    await setEventToDownload(newDataArray);
  };

  useEffect(() => {
    eventData ? linesCSV(eventData!) : '';
  }, [eventData]);

  return (
    <Button
      type='submit'
      variant='outlined'
      fullWidth
      sx={{
        color: '#228B22',
        borderColor: '#228B22',
      }}
    >
      <CSVLink
        data={eventToDownload}
        filename={`Attendees Report ${eventName}.csv`}
        className='btn btn-primary'
        target='_blank'
        style={{
          textDecoration: 'none',
          color: '#228B22',
          borderColor: '#228B22',
        }}
      >
        Download Attendees
      </CSVLink>
    </Button>
  );
}

export default DownloadAttendees;
