import dayjs from 'dayjs';
import { AlertColor } from '@mui/material';

export type Attendee = {
  id: string | undefined;
  firstName: string;
  lastName: string;
  course: string;
  email: string;
  avatarURL?: string;
};

export type EventDate = {
  date_event_start: dayjs.Dayjs;
  date_event_end: dayjs.Dayjs;
};

export type Tag = {
  id_tag?: number;
  name_tag?: string;
  id_event?: number;
};

export type Event = {
  name_event: string;
  description_event: string;
  dates_event: Array<EventDate>;
  location_event: string;
  capacity_event: number;
  price_event: number;
  category_event: string;
  tags: Array<Tag>;
  image_url_event: string;
  date_event_start?: string;
  attendees?: Array<Attendee>;
};

export type EventData = {
  name_event: string;
  location_event: string;
  date_event_start: string;
};

export type OtherInfo = {
  image_event: string;
  id_event: number;
  id_owner: string;
};

export interface AlertState {
  title: string;
  message: string;
  severity: AlertColor;
}

export interface User {
  firstName: string;
  lastName: string;
}
