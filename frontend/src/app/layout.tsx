/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from './theme-registry';
import { PageContextProvider } from '@/context/pageContext';
import { UserContextProvider } from '@/context/userContext';
import { EventContextProvider } from '@/context/eventContext';
import { DetailPageContextProvider } from '@/context/pageDetailContext';
import AuthProvider from '@/auth/auth-provider';
import { Box } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eventllege',
  description: 'Application for managing events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Outfit:wght@600&display=swap'
          rel='stylesheet'
        />
      </head>
      <Box component='body' position='relative'>
        <ThemeRegistry options={{ key: 'mui' }}>
          <PageContextProvider>
            <DetailPageContextProvider>
              <UserContextProvider>
                <EventContextProvider>
                  <AuthProvider>{children}</AuthProvider>
                </EventContextProvider>
              </UserContextProvider>
            </DetailPageContextProvider>
          </PageContextProvider>
        </ThemeRegistry>
      </Box>
    </html>
  );
}
