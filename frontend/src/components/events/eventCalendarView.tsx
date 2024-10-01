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
        {
          title: '1 activity',
          date: '2024-10-25',
          classNames: ['custom-event'],
          textColor: '#2c1229',
          details: 'details',
        },
        {
          title: '1 activity',
          date: '2024-10-25',
          classNames: ['custom-event'],
          textColor: '#2c1229',
          details: 'details',
        },
        { title: '1 activity', date: '2024-10-26' },
      ]}
    />
  );
};

export default EventCalendarView;
