import dayjs from 'dayjs';
import React, { Dispatch } from 'react';

export enum LoginStatus {
  Unknown = 'Unknown',
  LoggedIn = 'Logged In',
  LoggedOut = 'Logged Out',
  SigningUp = 'Singing Up',
}

export type User = {
  id: string;
  roleId: number;
  roleName: string;
  courseId: number;
  courseName: string;
  firstName: string;
  lastName: string;
  email: string;
  postalCode: string;
  phone: string;
  profilePhoto?: string;
  provider?: string;
  avatarURL: string;
  isVerified: boolean;
  studentId: number;
};

export type FirebaseAccount = {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  providerData?: Array<ProviderData>;
  studentId: string;
};

type ProviderData = {
  providerId: string;
};

export type UserContextProps = {
  user: User | null;
  setUser: (userStatus: User | null) => void;
  firebaseAccount: FirebaseAccount | null;
  setFirebaseAccount: React.Dispatch<
    React.SetStateAction<FirebaseAccount | null>
  >;
  loginStatus: LoginStatus;
  setLoginStatus: (loginStatus: LoginStatus) => void;
  error: ErrorMessage;
  setError: React.Dispatch<React.SetStateAction<ErrorMessage>>;
};

export type Attendee = {
  id: string | undefined;
  name: string | undefined;
};

export type DetailPageContextProps = {
  isAlertVisible: boolean;
  setIsAlertVisible: (state: boolean) => void;
  setAttendees: (
    state: (prevData: Attendee[] | undefined) => Attendee[]
  ) => void;
  setApplied: (state: boolean) => void;
};

export enum PageStatus {
  Loading = 'Loading',
  NotFound = 'Not Found',
  Ready = 'Ready',
}

export type PageContextProps = {
  pageStatus: PageStatus;
  setPageStatus: (pageStatus: PageStatus) => void;
  notFound: () => void;
};

export type Page = {
  label: string;
  path: string;
};

export type DateRange = {
  dateStart: dayjs.Dayjs;
  dateEnd: dayjs.Dayjs;
};

export type Tag = {
  id_tag: number;
  name_tag: string;
};
export type EventData = {
  name_event: string;
  description_event: string;
  dates: DateRange[];
  capacity_event: number;
  location_event: string;
  price_event: number;
  selectedTags: Array<Tag>;
  modality: Tag;
  category_event: string;
  image_event: string;
};

export type EventContextProps = {
  image: File | null;
  setImage: (image: File | null) => void;
  createdEvent: EventData;
  dispatch: Dispatch<EventAction>;
  initialState: EventData;
  showedPage: Page | null;
  setShowedPage: (showedPage: Page | null) => void;
  pathName: string;
};

export type EventAction = {
  type: string;
  payload: EventData;
};

export type ErrorMessage = {
  error: boolean;
  message: string;
};
