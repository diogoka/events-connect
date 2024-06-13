import { AlertColor } from '@mui/material';

export type AlertState = {
  showMessage?: boolean;
  status?: boolean;
  title?: string;
  message: string;
  severity: AlertColor;
};

export type RegisterMessage = {
  showMessage: boolean;
  message: string;
  severity: AlertColor;
};

export type PropsAlert = {
  registerMessage: RegisterMessage;
};
export type ShowAlert = {
  show: boolean;
  title: string;
  message: string;
};
