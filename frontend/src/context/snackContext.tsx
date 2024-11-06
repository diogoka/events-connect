'use client';
import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type SnackContextProps = {
  openSnackbar: (
    message: string,
    severity?: 'success' | 'error' | 'warning' | 'info'
  ) => void;
  closeSnackbar: () => void;
  isOpen: boolean;
};

const SnackContext = createContext<SnackContextProps | undefined>(undefined);

export const SnackProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info',
  });

  const openSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    setSnack({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnack((prev) => ({ ...prev, message: '', open: false }));
  };

  return (
    <SnackContext.Provider
      value={{ openSnackbar, closeSnackbar, isOpen: snack.open }}
    >
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snack.severity}
          variant='filled'
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </SnackContext.Provider>
  );
};

export const useSnack = () => {
  const context = useContext(SnackContext);
  if (!context) {
    throw new Error('useSnack must be used within a SnackProvider');
  }
  return context;
};
