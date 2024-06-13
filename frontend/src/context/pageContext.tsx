'use client';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { PageContextProps, PageStatus } from '@/types/context.types';

export const PageContext = createContext<PageContextProps>(
  {} as PageContextProps
);

export function PageContextProvider({ children }: { children: ReactNode }) {
  const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.Loading);

  const notFound = () => {
    setPageStatus(PageStatus.NotFound);
  };

  return (
    <PageContext.Provider value={{ pageStatus, setPageStatus, notFound }}>
      {children}
    </PageContext.Provider>
  );
}
