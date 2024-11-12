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

// New

export type EventModalType = {
  isOpen: boolean;
  eventId: number;
};

export type AttendeesListType = {
  event: {
    date_event_start: string;
    location_event: string;
    name_event: string;
  };
  attendees: [
    {
      email_user: string;
      first_name_user: string;
      last_name_user: string;
      student_id_user: string;
      users_courses: string;
    }
  ];
};
