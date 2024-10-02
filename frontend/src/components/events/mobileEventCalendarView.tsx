import React, { Dispatch, SetStateAction, useState } from 'react';
import { format, isAfter, isSameDay, isSameMonth } from 'date-fns';

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
            <Typography>No past events on this month</Typography>
          </Box>
        </Box>
      ) : (
        events.map((event) => {
          const eventStartDate = new Date(event.date_event_start);
          const dayNumber = format(eventStartDate, 'd');
          const dayOfWeek = format(eventStartDate, 'EEEE');
          const panelId = `panel${event.id_event}`;

          return (
            <Accordion
              key={event.id_event}
              expanded={expanded === panelId}
              onChange={handleChange(panelId)}
              sx={{ backgroundColor: 'inherit', padding: '12px 0' }}
              elevation={0}
            >
              <AccordionSummary
                aria-controls={`panel${event.id_event}-content`}
                id={`panel${event.id_event}-header`}
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '8px 16px',
                }}
              >
                <Typography>{event.name_event}</Typography>
                <Button
                  sx={{
                    backgroundColor: '#DDE1FF',
                    color: '#08164B',
                    padding: '8px 16px',
                  }}
                  onClick={() => {
                    handleDetailClick(event.id_event);
                  }}
                >
                  Details
                </Button>
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </Box>
  );
};

export default MobileEventCalendarView;
