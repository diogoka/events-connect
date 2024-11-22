import React, { useEffect, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
} from 'date-fns';
import { Box, Typography } from '@mui/material';
import { AttendedEvent, Event } from '@/types/pages.types';
import Holidays from 'date-holidays';
import { useRouter } from 'next/navigation';
import MultipleEventsOneDayModal from './multipleEventsOneDayModal';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Props = {
  eventsToCalendar: Event[];
  user: { id: string | undefined; role: string | undefined };
  attendedEvents: AttendedEvent[] | undefined;
};

type DayEvent = {
  name: string;
  id: number;
};

type EventByDateObject = {
  [key: string]: DayEvent[];
};

const EventCalendarView = ({
  eventsToCalendar,
  user,
  attendedEvents,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventsModal, setEventsModal] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);

  const startDate = startOfWeek(start, { weekStartsOn: 0 });
  const endDate = endOfWeek(end, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const monthYear = format(today, 'MMMM yyyy');
  const year = format(today, 'yyyy');

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const eventsByDate = events.reduce<EventByDateObject>((acc, event) => {
    const eventDate = format(new Date(event.date_event_start), 'yyyy-MM-dd');
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push({
      name: event.name_event,
      id: event.id_event,
    });
    return acc;
  }, {});

  const hd = new Holidays('CA', 'BC');
  const holidays = hd.getHolidays(year);

  const isHoliday = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');

    let isHoliday = false;
    holidays.map((holiday) => {
      const day = format(new Date(holiday.date), 'yyyy-MM-dd');

      if (day === formattedDate && holiday.type === 'public') {
        isHoliday = true;
      }
    });

    return isHoliday;
  };

  const router = useRouter();

  const handleClickDaySingleEvent = (id: number) =>
    router.push(`/events/${id}`);

  const handleClickDayMultipleEvent = (param: DayEvent[]) => {
    const matchedEvents = param
      .map((event: DayEvent) => {
        return events.find((e) => e.id_event === event.id);
      })
      .filter(
        (event: Event | undefined): event is Event => event !== undefined
      );

    setEventsModal(matchedEvents);
    handleOpen();
  };

  useEffect(() => {
    setEvents(eventsToCalendar);
  }, [eventsToCalendar, eventsModal]);

  return (
    <>
      <MultipleEventsOneDayModal
        isOpen={isModalOpen}
        handleClose={handleClose}
        events={eventsModal}
        attendedEvents={attendedEvents}
        user={user}
      />
      <Box sx={{ width: '100%', paddingBottom: '104px' }}>
        <Typography
          sx={{
            fontSize: '32px',
            fontWeight: 400,
            marginBottom: '24px',
          }}
        >
          {monthYear}
        </Typography>
        {/* Calendar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              marginBottom: '16px',
            }}
          >
            {daysOfWeek.map((dayName, index) => (
              <Box
                key={index}
                sx={{
                  padding: '16px',
                  textAlign: 'center',
                  fontWeight: '500',
                  backgroundColor: '#EFEDF4',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  fontSize: '16px',
                }}
              >
                {dayName}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '16px',
            }}
          >
            {days.map((day, index) => {
              const eventDate = format(day, 'yyyy-MM-dd');
              const dayEvents = eventsByDate[eventDate] || [];

              const activityMessage =
                dayEvents.length === 0
                  ? ''
                  : dayEvents.length === 1
                  ? dayEvents[0].name
                  : `${dayEvents[0].name} and +`;

              const numberOfActivities =
                dayEvents.length === 0
                  ? 'No activity'
                  : dayEvents.length === 1
                  ? '1 activity'
                  : `${dayEvents.length} activities`;

              const displayMessage = isHoliday(day)
                ? 'Holiday'
                : numberOfActivities;

              return (
                <Box
                  key={index}
                  component={'button'}
                  sx={{
                    textAlign: 'center',
                    minHeight: '224px',
                    maxHeight: '224px',
                    minWidth: '130px',
                    backgroundColor: isSameMonth(day, today)
                      ? '#FBF8FF'
                      : '#e0e0e0',
                    color: isSameMonth(day, today) ? 'black' : '#aaa',
                    borderRadius: '6px',
                    border: '2px solid #efedf4',
                    cursor: dayEvents.length === 0 ? '' : 'pointer',
                  }}
                  disabled={dayEvents.length === 0}
                  onClick={() => {
                    if (dayEvents.length === 1) {
                      handleClickDaySingleEvent(dayEvents[0].id);
                    } else {
                      handleClickDayMultipleEvent(dayEvents);
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-around',
                      padding: '8px 16px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: isHoliday(day) ? '#FFFFFF' : '#2C1229',
                        fontWeight: 300,
                        backgroundColor: isHoliday(day)
                          ? '#BA1A1A'
                          : dayEvents.length === 0
                          ? '#ffd7f337'
                          : '#FFD7F3',
                        borderRadius: '6px',
                        padding: '8px',
                        width: 'fit-content',
                        opacity: isSameMonth(day, today) ? 1 : 0.5,
                      }}
                    >
                      {displayMessage}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '25px',
                        color: isSameMonth(day, today) ? '#1B1B21' : '#aaa',
                        fontWeight: 500,
                        textAlign: 'start',
                      }}
                    >
                      {format(day, 'd')}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        color: isSameMonth(day, today) ? '#1B1B21' : '#aaa',
                        fontWeight: 500,
                        minHeight: '48px',
                      }}
                    >
                      {activityMessage.length > 5
                        ? activityMessage.slice(0, 13) + '...'
                        : activityMessage}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EventCalendarView;
