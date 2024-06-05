import { RegisterMessage, PropsBackground } from '@/types/types';
import { Alert } from '@mui/material';

const AlertMessage = ({ registerMessage }: PropsBackground) => {
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
