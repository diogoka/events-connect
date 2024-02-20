import { Fragment } from 'react';
import { Box, Typography } from '@mui/material';
import {
  getDayName,
  getMonthName,
  getTimeString,
} from '../../common/functions';
import { Event, OtherInfo, EventDate } from '@/types/types';
import IconsContainer from '../icons/iconsContainer';

type Props = {
  event: Event;
  applied: boolean;
  organizerEvent: boolean;
  otherInfo: OtherInfo;
  forMobile: boolean;
};

export type EventDateString = {
  date_event_start: string;
  date_event_end: string;
};

const DetailTimeContainer = ({ event, otherInfo, forMobile }: Props) => {
  const deepCopy = event?.dates_event.map((dt: EventDate) => ({
    date_event_start: dt.date_event_start,
    date_event_end: dt.date_event_end,
  }));

  const setDate = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return {
      date_event_start: `
      ${getDayName(startDate.getDay())}, 
      ${getMonthName(startDate.getMonth())} ${startDate.getDate()}, 
      ${startDate.getFullYear()}, ${getTimeString(startDate)}`,

      date_event_end:
        startDate.getMonth() == endDate.getMonth() &&
        startDate.getDate() == endDate.getDate() &&
        startDate.getFullYear() == endDate.getFullYear()
          ? `${getTimeString(endDate)}`
          : `${getDayName(endDate.getDay())}, 
      ${getMonthName(endDate.getMonth())} ${endDate.getDate()}, 
      ${endDate.getFullYear()}, ${getTimeString(endDate)}`,
    };
  };

  const eventDates = deepCopy?.map((dt: EventDate) =>
    setDate(dt.date_event_start.toString(), dt.date_event_end.toString())
  );

  const timeContainerStyle = {
    marginTop: '3px',
    fontSize: forMobile ? 'auto' : '1.2em',
  };

  return (
    <>
      {eventDates?.map((dt: EventDateString, key: number) => {
        return (
          <Fragment key={key}>
            <Box display='flex' alignItems='center'>
              <IconsContainer
                icons={[
                  { name: 'FaClock', isClickable: false, color: '#333333' },
                ]}
                onIconClick={() => {
                  return;
                }}
              />
              <Typography sx={timeContainerStyle}>
                {dt.date_event_start}&nbsp;-&nbsp;{dt.date_event_end}
              </Typography>
            </Box>
          </Fragment>
        );
      })}
    </>
  );
};

export default DetailTimeContainer;
