import { Box, Alert, AlertColor } from '@mui/material';
import React from 'react';

type Props = {
  searchParams: {
    t: string;
  };
};

const verificationPage = async ({ searchParams }: Props) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL_CHECK}${searchParams.t}`,
    { cache: 'no-store', method: 'POST' }
  );
  const status = response.status;
  const data = await response.json();

  let severity: AlertColor;
  switch (status) {
    case 200:
      severity = 'success';
      break;
    case 400:
      severity = 'info';
      break;
    case 401:
    default:
      severity = 'error';
      break;
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '40%',
        borderRadius: '5px',
        padding: '50px 50px',
      }}
    >
      <Alert variant='filled' severity={severity}>
        {data}
      </Alert>
    </Box>
  );
};

export default verificationPage;
