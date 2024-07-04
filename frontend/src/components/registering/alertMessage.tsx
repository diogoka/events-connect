import { PropsAlert } from '@/types/alert.types';
import { Alert } from '@mui/material';

type Props = PropsAlert & { isMobile: boolean };

const AlertMessage = ({ registerMessage, isMobile }: Props) => {
  return (
    <>
      {registerMessage.showMessage && (
        <Alert
          sx={{
            width: isMobile ? '80%' : '28%',
            margin: isMobile ? '0' : '2%',
            position: 'absolute',
          }}
          severity={registerMessage.severity}
        >
          {registerMessage.message}
        </Alert>
      )}
    </>
  );
};

export default AlertMessage;
