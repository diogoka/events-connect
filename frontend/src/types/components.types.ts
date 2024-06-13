export type Course = {
  id: number;
  name: string;
  category: string;
};

export type Coordinate = {
  lat: number;
  lng: number;
};

export enum PasswordResetStatus {
  BeforeSending,
  Successful,
  Failed,
}

export type Page = {
  label: string;
  path: string;
};

export type CategoryType = {
  category_course: string;
};

export type EventDateString = {
  date_event_start: string;
  date_event_end: string;
};
