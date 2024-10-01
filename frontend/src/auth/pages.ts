import { Page, Limitation } from '@/types/auth-provider.types';

export const PAGES: Page[] = [
  {
    path: /^\/$/,
    limitation: Limitation.None,
    isLoadingRequired: false,
  },
  {
    path: /^\/events$/,
    limitation: Limitation.None,
    isLoadingRequired: true,
  },
  {
    path: /^\/events\/\d+$/,
    limitation: Limitation.None,
    isLoadingRequired: true,
  },
  {
    path: /^\/signup$/,
    limitation: Limitation.None,
    isLoadingRequired: false,
  },
  {
    path: /^\/login$/,
    limitation: Limitation.None,
    isLoadingRequired: false,
  },
  {
    path: /^\/user$/,
    limitation: Limitation.LoggedIn,
    isLoadingRequired: false,
  },
  {
    path: /^\/user\/edit$/,
    limitation: Limitation.LoggedIn,
    isLoadingRequired: false,
  },
  {
    path: /^\/history$/,
    limitation: Limitation.LoggedIn,
    isLoadingRequired: true,
  },
  {
    path: /^\/user\/my-events$/,
    limitation: Limitation.LoggedIn,
    isLoadingRequired: true,
  },
  {
    path: /^\/events\/new$/,
    limitation: Limitation.Organizer,
    isLoadingRequired: false,
  },
  {
    path: /^\/events\/new\/preview$/,
    limitation: Limitation.Organizer,
    isLoadingRequired: false,
  },
  {
    path: /^\/events\/\d+\/edit$/,
    limitation: Limitation.Organizer,
    isLoadingRequired: true,
  },
  {
    path: /^\/organizer-events$/,
    limitation: Limitation.Organizer,
    isLoadingRequired: true,
  },
  {
    path: /^\/verification$/,
    limitation: Limitation.None,
    isLoadingRequired: true,
  },
];
