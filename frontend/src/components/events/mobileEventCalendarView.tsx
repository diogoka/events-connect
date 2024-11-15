import React, { Dispatch, SetStateAction, useState } from 'react';
import { format } from 'date-fns';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Typography, Button, Box } from '@mui/material';
import { Event } from '@/types/pages.types';

import removeIconSvg from '../../../public/icons/removeIcon.svg';
import plusIconSvg from '../../../public/icons/plusIcon.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
  events: Event[];
};

const MobileEventCalendarView = ({ events }: Props) => {
  const today = new Date();
  const monthYear = format(today, 'MMMM yyyy');

  const [expanded, setExpanded] = useState<string | false>(false);
  const router = useRouter();

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleDetailClick = (id: number) => router.push(`/events/${id}`);

  const groupedEvents = events.reduce((acc, event) => {
    const eventStartDate = new Date(event.date_event_start);
    const formattedDate = format(eventStartDate, 'yyyy-MM-dd');

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const sortedGroupedEvents = Object.entries(groupedEvents)
    .map(([date, events]) => ({
      date,
      events: events.sort(
        (a, b) =>
          new Date(a.date_event_start).getTime() -
          new Date(b.date_event_start).getTime()
      ),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        paddingBottom: '42px',
        paddingTop: '16px',
      }}
    >
      <Typography variant='h5' sx={{ paddingLeft: '2px' }}>
        {monthYear}
      </Typography>

      {events.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '32px 0',
            minHeight: '120px',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#FFD7F3',
              padding: '8px 16px',
              borderRadius: '6px',
            }}
          >
            <Typography>No past events this month</Typography>
          </Box>
        </Box>
      ) : (
        sortedGroupedEvents.map(({ date, events }) => {
          const eventStartDate = new Date(events[0].date_event_start);
          const dayNumber = format(eventStartDate, 'd');
          const dayOfWeek = format(eventStartDate, 'EEEE');
          const panelId = `panel${date}`;

          return (
            <Accordion
              key={panelId}
              expanded={expanded === panelId}
              onChange={handleChange(panelId)}
              sx={{ backgroundColor: 'inherit', padding: '12px 0' }}
              elevation={0}
            >
              <AccordionSummary
                aria-controls={`panel${panelId}-content`}
                id={`panel${panelId}-header`}
                expandIcon={
                  <Image
                    src={expanded === panelId ? removeIconSvg : plusIconSvg}
                    alt={expanded === panelId ? 'minus icon' : 'plus icon'}
                  />
                }
                sx={{ backgroundColor: 'inherit' }}
              >
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Typography
                    sx={{ fontSize: '24px', fontWeight: 500, color: '#4F5B92' }}
                  >
                    {dayNumber}
                  </Typography>
                  <Typography sx={{ fontSize: '24px', fontWeight: 500 }}>
                    {dayOfWeek}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: '#F5F2FA',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '8px 16px',
                }}
              >
                {events.map((event) => (
                  <Box
                    key={event.id_event}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography>{event.name_event}</Typography>
                    <Button
                      sx={{
                        backgroundColor: '#DDE1FF',
                        color: '#08164B',
                        padding: '8px 16px',
                      }}
                      onClick={() => handleDetailClick(event.id_event)}
                    >
                      Details
                    </Button>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </Box>
  );
};

export default MobileEventCalendarView;
