'use client';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export type Attendee = {
  id: string | undefined;
  name: string | undefined;
};

type DetailPageContextProps = {
  isAlertVisible: boolean;
  setIsAlertVisible: (state: boolean) => void;
  setAttendees: (
    state: (prevData: Attendee[] | undefined) => Attendee[]
  ) => void;
  setApplied: (state: boolean) => void;
};

export const DetailPageContext = createContext<DetailPageContextProps>(
  {} as DetailPageContextProps
);

export function DetailPageContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [attendees, setAttendees] = useState<Attendee[]>();
  const [applied, setApplied] = useState<boolean>(false);

  return (
    <DetailPageContext.Provider
      value={{
        isAlertVisible,
        setIsAlertVisible,
        setAttendees,
        setApplied,
      }}
    >
      {children}
    </DetailPageContext.Provider>
  );
}
