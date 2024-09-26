import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';

import './calendarStyle/style.css';

type Props = {};

const EventCalendarView = (props: Props) => {
  const handleDateClick = (arg: any) => {
    alert(arg.dateStr);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      dateClick={handleDateClick}
      fixedWeekCount={false}
    />
  );
};

export default EventCalendarView;
