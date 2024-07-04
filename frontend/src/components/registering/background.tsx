import { Box } from '@mui/material';
import AlertMessage from './alertMessage';
import { PropsAlert } from '@/types/alert.types';

type Props = PropsAlert & { isMobile: boolean };

const Background = ({ registerMessage, isMobile }: Props) => {
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
      <AlertMessage registerMessage={registerMessage} isMobile={isMobile} />
    </Box>
  );
};

export default Background;
