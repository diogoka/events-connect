import { Tag as ContextTag } from '@/types/context.types';
import dayjs from 'dayjs';

export type Event = {
  id_event: number;
  id_owner: string;
  name_event: string;
  description_event: string;
  date_event_start: string;
  date_event_end: string;
  location_event: string;
  capacity_event: number;
  price_event: number;
  image_event: string;
  category_event: string;
};

export interface HistoryEvent extends Event {
  attendees?: any;
}

export interface Events extends Event {
  image_url_event?: string;
}

export interface SelectedEvent extends Event {
  image_url_event: string;
  tags: Array<ContextTag>;
}

export type EventData = {
  name_event: string;
  description_event: string;
  dates_event: DateRange[];
  capacity_event: number;
  location_event: string;
  price_event: number;
  tags: Tag[];
  category_event: string;
  image_url_event: string;
};

export type Tag = {
  id_event?: number;
  id_tag?: number;
  name_tag: string;
};

export type CurrentUser = {
  id: string;
  role: string;
};

export type User = {
  firstName: string;
  lastName: string;
};

export type HasEvents = {
  eventFound: boolean;
  message: string;
};

export type DateRange = {
  date_event_start: dayjs.Dayjs;
  date_event_end: dayjs.Dayjs;
};

export type ReplaceDates = {
  dateStart: dayjs.Dayjs;
  dateEnd: dayjs.Dayjs;
};

export type Params = {
  params: {
    id: number;
  };
};

export type UserInputForm = {
  firstName: string;
  lastName: string;
  courseId: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  student_id: number;
};

export interface UserInputDTO extends UserInputForm {
  id: string;
  type: number;
  provider: string;
  avatarURL: string;
  is_verified: boolean;
}

export interface UserEditInfo extends User {
  courseId: string;
}
