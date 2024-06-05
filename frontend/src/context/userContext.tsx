'use client';
import React, { createContext, ReactNode, useState } from 'react';
import { FirebaseAccount } from '../types/types';

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

type UserContextProps = {
  user: User | null;
  setUser: (userStatus: User | null) => void;
  firebaseAccount: FirebaseAccount | null;
  setFirebaseAccount: React.Dispatch<
    React.SetStateAction<FirebaseAccount | null>
  >;
  loginStatus: LoginStatus;
  setLoginStatus: (loginStatus: LoginStatus) => void;
};

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [firebaseAccount, setFirebaseAccount] =
    useState<FirebaseAccount | null>(null);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.LoggedOut
  );

  console.log('User-context: ', user);
  console.log('FirebaseAccount-context', firebaseAccount);
  console.log('login-status-context', loginStatus);

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
