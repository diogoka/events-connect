'use client';
import React, { useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { initializeFirebase } from '@/auth/firebase';

import { getAuth, signOut } from 'firebase/auth';
import { Box, useMediaQuery } from '@mui/material';
import { UserContext } from '@/context/userContext';
import { PageContext } from '@/context/pageContext';
import { LoginStatus, PageStatus } from '@/types/context.types';
import Header from '@/components/header/header';
import Footer from '@/components/footer';
import Loading from '@/app/loading';
import NotFound from '@/components/common/notFound';
import { Page, Limitation, Permission } from '@/types/auth-provider.types';

import { PAGES } from './pages';

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
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

  const laptopQuery = useMediaQuery('(min-width:769px)');

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
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${
              firebaseAccount!.uid
            }`,
            {
              provider: firebaseAccount!.providerData,
              email: firebaseAccount!.email,
            },
            { headers: { 'Content-type': 'application/json' } }
          )
          .then((res: any) => {
            if (res.data) {
              setUser(res.data);
              setFirebaseAccount((prevState) => {
                return {
                  ...prevState!,
                  uid: res.data.id_user,
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
    const hideHeaderPaths = ['/signup', '/login', '/verification', '/'];

    if (
      pathname.length > 0 &&
      !hideHeaderPaths.includes(pathname) &&
      pageStatus === PageStatus.Ready
    ) {
      return true;
    }
    return false;
  };

  const getComponent = (laptopQuery: boolean, pathname: string) => {
    switch (pageStatus) {
      case PageStatus.Loading:
        return (
          <>
            <Loading />
          </>
        );
      case PageStatus.Ready:
        return (
          <Box
            component='main'
            padding={
              pathname === '/login' ||
              pathname === '/' ||
              pathname === '/signup'
                ? 0
                : laptopQuery
                ? '0 104px'
                : '0 24px'
            }
          >
            <Box flexGrow={1}>{children}</Box>
          </Box>
        );
      case PageStatus.NotFound:
        return <NotFound />;
    }
  };

  return (
    <>
      {isHeaderReady() && <Header />}
      {getComponent(laptopQuery, pathname)}
      {pathname !== '/' && pathname !== '/verification' && (
        <Footer laptopQuery={laptopQuery} />
      )}
    </>
  );
};

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

export default AuthProvider;
