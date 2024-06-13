export enum Limitation {
  None, // Pages with no limitation
  LoggedIn, // Pages only for logged in users
  Organizer, // Pages only for organizers
  Admin, // Pages only for administrators
}

export type Page = {
  path: RegExp;
  limitation: Limitation;
  isLoadingRequired: boolean;
};

export type Permission = {
  isAllowed: boolean;
  redirection: string;
};
