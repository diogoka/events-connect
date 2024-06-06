import { Box } from '@mui/material';
import AlertMessage from './alertMessage';
import { PropsAlert } from '@/types/alert.types';

const Background = ({ registerMessage }: PropsAlert) => {
  return (
    <Box
      width='100%'
      height='calc(100vh - 4rem)'
      position='absolute'
      sx={{
        inset: '4rem auto auto 0',
        backgroundImage: 'url("/auth-bg.png")',
        backgroundSize: 'cover',
        backgroundPositionX: '50%',
      }}
    >
      <AlertMessage registerMessage={registerMessage} />
    </Box>
  );
};

export default Background;
