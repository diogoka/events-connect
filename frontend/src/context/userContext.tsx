'use client';
import React, { createContext, ReactNode, useState } from 'react';
import {
  UserContextProps,
  User,
  FirebaseAccount,
  LoginStatus,
  ErrorMessage,
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
  const [error, setError] = useState<ErrorMessage>({
    error: false,
    message: '',
  });

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        firebaseAccount,
        setFirebaseAccount,
        loginStatus,
        setLoginStatus,
        error,
        setError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
