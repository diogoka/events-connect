'use client';
import React, { createContext, ReactNode, useState } from 'react';
import {
  UserContextProps,
  User,
  FirebaseAccount,
  LoginStatus,
} from '@/types/context.types';

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [firebaseAccount, setFirebaseAccount] =
    useState<FirebaseAccount | null>(null);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.Unknown
  );
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        firebaseAccount,
        setFirebaseAccount,
        loginStatus,
        setLoginStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
