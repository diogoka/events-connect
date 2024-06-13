import { PropsAlert } from '@/types/alert.types';
import { Alert } from '@mui/material';

const AlertMessage = ({ registerMessage }: PropsAlert) => {
  return (
    <>
      {registerMessage.showMessage && (
        <Alert
          sx={{ width: '28%', margin: '2%' }}
          severity={registerMessage.severity}
        >
          {registerMessage.message}
        </Alert>
      )}
    </>
  );
};

export default AlertMessage;
