import { Box } from '@mui/material';
import React from 'react';

type Props = {
  children: React.ReactNode;
  width?: string;
  isMobile: boolean;
  firstField?: boolean;
  lastField?: boolean;
};

const EventInformationContainer: React.FC<Props> = ({
  children,
  width = '100%',
  isMobile,
  firstField = false,
  lastField = false,
}: Props) => {
  return (
    <Box
      sx={{
        width,
        backgroundColor: '#F5F2FA',
        // backgroundColor: '#000000',
        borderRadius: isMobile
          ? '8px'
          : firstField
          ? '8px 0 0 8px'
          : lastField
          ? '0 8px 8px 0px'
          : '0',
        display: 'flex',
        alignItems: isMobile ? 'center' : 'flex-start',
        padding: '16px',
        gap: isMobile ? '8px' : '0',
        minHeight: '80px',
        flexDirection: isMobile ? 'row' : 'column',
        justifyContent: isMobile ? 'flex-start' : 'space-evenly',
      }}
    >
      {children}
    </Box>
  );
};

export default EventInformationContainer;
