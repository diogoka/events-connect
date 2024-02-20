'use client';
import { AlertTitle, Alert, AlertColor } from '@mui/material';

const alertFn = (
  title: string,
  message: string,
  severity: AlertColor,
  onCloseFn: (event: React.SyntheticEvent) => void
) => {
  return (
    <Alert
      severity={severity}
      onClose={onCloseFn}
      variant='filled'
      sx={{
        width: 'max-content',
        position: 'absolute',
        left: '50%',
        bottom: '76%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999999,
      }}
    >
      <AlertTitle sx={{ color: 'white' }}>{title}</AlertTitle>
      {message}
    </Alert>
  );
};

export default alertFn;
