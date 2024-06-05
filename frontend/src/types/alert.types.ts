import { AlertColor } from '@mui/material';

export type AlertState = {
  showMessage?: boolean;
  title?: string;
  message: string;
  severity: AlertColor;
};

export type RegisterMessage = {
  showMessage: boolean;
  message: string;
  severity: AlertColor;
};
