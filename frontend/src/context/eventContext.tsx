'use client';
import React, {
  createContext,
  ReactNode,
  useState,
  useReducer,
  Dispatch,
} from 'react';
import { usePathname } from 'next/navigation';
import dayjs from 'dayjs';

import {
  EventData,
  Tag,
  EventAction,
  EventContextProps,
  Page,
} from '@/types/context.types';

export const today = dayjs();
export const hourOfToday = today.add(1, 'hour');
export const endHourOfToday = hourOfToday.add(30, 'minute');

export const initialState: EventData = {
  name_event: '',
  description_event: '',
  dates: [{ dateStart: hourOfToday, dateEnd: endHourOfToday }],
  capacity_event: -1,
  location_event: '',
  price_event: 0,
  selectedTags: [],
  modality: { id_tag: 16, name_tag: 'Online' } as Tag,
  category_event: '',
  image_event: '',
};

export const eventReducer = (state: EventData, action: EventAction) => {
  switch (action.type) {
    case 'UPDATE_TITLE':
      return { ...state, name_event: action.payload.name_event };
    case 'UPDATE_DESCRIPTION':
      return { ...state, description_event: action.payload.description_event };
    case 'UPDATE_DATES':
      return { ...state, dates: action.payload.dates };
    case 'UPDATE_LOCATION':
      return { ...state, location_event: action.payload.location_event };
    case 'UPDATE_PRICE':
      return { ...state, price_event: action.payload.price_event };
    case 'UPDATE_SPOTS':
      return { ...state, capacity_event: action.payload.capacity_event };
    case 'UPDATE_CATEGORY':
      return { ...state, category_event: action.payload.category_event };
    case 'UPDATE_SELECTED_TAGS':
      return { ...state, selectedTags: action.payload.selectedTags };
    case 'UPDATE_MODALITY':
      return { ...state, modality: action.payload.modality };
    case 'GET_WHOLE_DATA':
      return action.payload;
    case 'UPDATE_ALL_FIELDS':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};
export const EventContext = createContext<EventContextProps>(
  {} as EventContextProps
);

export function EventContextProvider({ children }: { children: ReactNode }) {
  const pathName = usePathname();
  const [showedPage, setShowedPage] = useState<Page | null>({
    label: 'Events',
    path: '/',
  });
  const [image, setImage] = useState<File | null>(null);
  const [createdEvent, dispatch]: [EventData, Dispatch<EventAction>] =
    useReducer(eventReducer, initialState);

  console.log('context', createdEvent);

  return (
    <EventContext.Provider
      value={{
        createdEvent,
        dispatch,
        initialState,
        image,
        setImage,
        showedPage,
        setShowedPage,
        pathName,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
