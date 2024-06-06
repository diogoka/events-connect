'use client';
import React, { createContext, ReactNode, useState } from 'react';
import { DetailPageContextProps, Attendee } from '@/types/context.types';

export const DetailPageContext = createContext<DetailPageContextProps>(
  {} as DetailPageContextProps
);

export function DetailPageContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [, setAttendees] = useState<Attendee[]>();
  const [, setApplied] = useState<boolean>(false);

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
