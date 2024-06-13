import dayjs from 'dayjs';

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

export type EventDate = {
  date_event_start: dayjs.Dayjs;
  date_event_end: dayjs.Dayjs;
};

export type Attendee = {
  id: string | undefined;
  firstName: string;
  lastName: string;
  course: string;
  email: string;
  avatarURL?: string;
};

export type Tag = {
  id_tag?: number;
  name_tag?: string;
  id_event?: number;
};

export type OtherInfo = {
  image_event: string;
  id_event: number;
  id_owner: string;
};

export type EventPage = {
  capacity_event: number;
  category_event: string;
  date_event_end: string;
  date_event_start: string;
  description_event: string;
  id_event: number;
  id_owner: string;
  image_event: string;
  location_event: string;
  name_event: string;
  price_event: number;
  image_url_event?: string;
};

export type CurrentUser = {
  id: string | undefined;
  role: string | undefined;
};

export type ParamEditPage = {
  id: number;
};

export type SelectedEvent = {
  id_event: number;
  id_owner: string;
  name_event: string;
  description_event: string;
  date_event_start: string;
  date_event_end: string;
  image_url_event: string;
  location_event: string;
  capacity_event: number;
  price_event: number;
  category_event: string;
  tags: Array<Tag>;
};

export type ReplaceDates = {
  dateStart: dayjs.Dayjs;
  dateEnd: dayjs.Dayjs;
};
