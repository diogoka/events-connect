import dayjs from 'dayjs';

export type Attendee = {
  users: {
    first_name_user: string;
    last_name_user: string;
    avatarURL?: string;
    id_user: string;
  };
};

export type EventDate = {
  date_event_start: dayjs.Dayjs;
  date_event_end: dayjs.Dayjs;
};

export type Tag = {
  tags: {
    id_tag?: number;
    name_tag?: string;
    id_event?: number;
  };
};

export type Event = {
  name_event: string;
  description_event: string;
  dates_event: Array<EventDate>;
  location_event: string;
  capacity_event: number;
  price_event: number;
  category_event: string;
  events_tags: Array<Tag>;
  image_url_event: string;
  date_event_start?: string;
  date_event_end?: string;
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

export type ErrorMessage = {
  error: boolean;
  message: string;
};
