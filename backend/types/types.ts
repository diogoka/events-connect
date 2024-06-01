export type Attendee = {
  id: string;
  firstName: string;
  lastName: string;
  course: string;
  email: string;
};

export type EventInput = {
  owner: string;
  title: string;
  description: string;
  dates: Array<Date>;
  location: string;
  spots: number;
  price: number;
  image: string;
  tag: number;
};

export type Date = {
  dateStart: string;
  dateEnd: string;
};

export type UserInput = {
  id: string;
  type: number;
  courseId: number;
  firstName: string;
  lastName: string;
  email: string;
  postalCode: string;
  phone: string;
  provider: string;
  avatarURL: string;
  is_verified: boolean;
};

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  provider: string;
  avatarURL: string | null;
  roleId: number;
  roleName: string;
  postalCode: string | null;
  courseId: number;
  courseName: string;
  is_verified: boolean;
};
