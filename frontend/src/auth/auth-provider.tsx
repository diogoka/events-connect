'use client';
import React, { useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { initializeFirebase } from '@/auth/firebase';

import { getAuth, deleteUser, signOut } from 'firebase/auth';
import { Box } from '@mui/material';
import { UserContext } from '@/context/userContext';
import { PageContext } from '@/context/pageContext';
import { LoginStatus, PageStatus } from '@/types/context.types';
import Header from '@/components/header/header';
import Footer from '@/components/footer';
import Loading from '@/app/loading';
import NotFound from '@/components/common/notFound';
import { Page, Limitation, Permission } from '@/types/auth-provider.types';

const PAGES: Page[] = [
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

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { pageStatus, setPageStatus } = useContext(PageContext);
  const {
    user: userContext,
    setUser,
    setFirebaseAccount,
    loginStatus,
    setLoginStatus,
    firebaseAccount: firebaseAccountContext,
    setError,
  } = useContext(UserContext);

  useEffect(() => {
    initializeFirebase;
    const auth = getAuth();

    auth.onAuthStateChanged(async (firebaseAccount) => {
      // Use this handler only when user accesses to our page

      if (
        loginStatus === LoginStatus.LoggedIn ||
        loginStatus === LoginStatus.LoggedOut
      ) {
        return;
      }

      if (firebaseAccount) {
        setFirebaseAccount({
          uid: firebaseAccount!.uid,
          email: firebaseAccount!.email,
          providerData: firebaseAccount!.providerData,
          studentId: 0,
          photoURL: firebaseAccount.photoURL,
        });

        // Get user data from server
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${
              firebaseAccount!.uid
            }`
          )
          .then((res: any) => {
            if (res.data) {
              setUser(res.data);
              setFirebaseAccount((prevState) => {
                return {
                  ...prevState!,
                  studentId: res.data.student_id!,
                };
              });
              setLoginStatus(LoginStatus.LoggedIn);
            } else {
              setLoginStatus(LoginStatus.SigningUp);
            }
          })
          .catch((error: any) => {
            // need to have the message here
            //need to handle properly
            if (error.response.data === 'Email is not verified.') {
              setLoginStatus(LoginStatus.LoggedOut);
              signOut(getAuth());
              setError({ error: true, message: 'Please verify your email.' });
            } else {
              setLoginStatus(LoginStatus.SigningUp);
            }
          });
      }
      // When the user logged out or doesn't have an account
      else {
        setLoginStatus(LoginStatus.LoggedOut);
        signOut(getAuth());
      }
    });
  }, []);

  const isAllowedPage = (): Permission => {
    const page = getPage(pathname);
    if (page === undefined) {
      return { isAllowed: true, redirection: '' };
    }
    // Wait until the login status is confirmed
    else if (loginStatus === LoginStatus.Unknown) {
      return { isAllowed: false, redirection: '' };
    }
    // If user is logged in
    else if (loginStatus === LoginStatus.LoggedIn) {
      // If this user is a student
      if (userContext) {
        if (userContext.roleName === 'student') {
          // Give permission only to allowed pages
          if (
            !(
              page.limitation === Limitation.None ||
              page.limitation === Limitation.LoggedIn
            )
          ) {
            return { isAllowed: false, redirection: '/events' };
          }
        }
      } else {
        // eslint-disable-next-line quotes
        console.error("User is logged in but the data doesn't exist");
        return { isAllowed: false, redirection: '/events' };
      }
    }
    // If this user is not logged in
    else if (loginStatus === LoginStatus.LoggedOut) {
      // Give permission only to allowed pages
      if (page.limitation !== Limitation.None) {
        // Go to the login page, but don't redirect from sign-up page
        if (pathname !== '/signup' && pathname !== '/login') {
          return { isAllowed: false, redirection: '/login' };
        }
      }
    }
    // If this user is in the process of sign-up
    else if (loginStatus === LoginStatus.SigningUp) {
      // Go to the signup page, but don't redirect from sign-up page

      if (pathname === '/login') {
        return { isAllowed: true, redirection: '' };
      }

      if (pathname === '/events' || pathname === '/') {
        return { isAllowed: true, redirection: '' };
      }
      if (pathname !== '/signup') {
        return { isAllowed: false, redirection: '/signup' };
      }
    }

    return { isAllowed: true, redirection: '' };
  };

  // When the user switches the page, check the page restriction
  useEffect(() => {
    const result: Permission = isAllowedPage();

    if (!result.isAllowed && result.redirection) {
      router.replace(result.redirection);
    }
  }, [pathname, loginStatus]);

  useEffect(() => {
    if (loginStatus === LoginStatus.Unknown) {
      setPageStatus(PageStatus.Loading);
    } else {
      setPageStatus(PageStatus.Ready);
    }
  }, [pathname, loginStatus]);

  const isHeaderReady = (): boolean => {
    if (
      pathname.length > 0 &&
      pathname !== '/login' &&
      pathname !== '/verification' &&
      pathname !== '/' &&
      pageStatus === PageStatus.Ready
    ) {
      return true;
    }
    return false;
  };

  const getComponent = () => {
    switch (pageStatus) {
      case PageStatus.Loading:
        return (
          <>
            <Loading />
          </>
        );
      case PageStatus.Ready:
        return (
          <>
            <Box
              component='main'
              maxWidth='1280px'
              minHeight='100vh'
              paddingInline='40px'
              paddingBlock='50px'
              marginInline='auto'
            >
              {children}
            </Box>
          </>
        );
      case PageStatus.NotFound:
        return <NotFound />;
    }
  };

  return (
    <>
      {isHeaderReady() && <Header />}
      {getComponent()}
      <Footer />
    </>
  );
}

// Not deleting the account for now to avoid unexpected errors

// export const deleteAccount = async () => {
//   getAuth().onAuthStateChanged(async (firebaseAccount) => {
//     if (firebaseAccount) {
//       const deleted = await deleteUser(firebaseAccount!);
//     } else {
//       console.log('No user is authenticated.');
//     }
//   });
// };

function getPage(pathname: string): Page | undefined {
  return PAGES.find((PAGE: Page) => {
    return PAGE.path.test(pathname);
  });
}
