import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';

import './calendarStyle/style.css';
import { Box } from '@mui/material';
import { red } from '@mui/material/colors';

type Props = {};

const EventCalendarView = (props: Props) => {
  const handleDateClick = (arg: any) => {
    console.log(arg);
    alert(arg.dateStr);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      dateClick={handleDateClick}
      fixedWeekCount={false}
      events={[
        { title: 'event 1', date: '2024-09-25', details: 'details' },
        { title: 'event 2', date: '2024-09-26' },
        { title: 'event 2.1', date: '2024-09-26' },
      ]}
    />
  );
};

export default EventCalendarView;
