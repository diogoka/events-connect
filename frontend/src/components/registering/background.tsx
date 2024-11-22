import { Box } from '@mui/material';

const Background = () => {
  return (
    <Box
      width='50%'
      sx={{
        backgroundImage: 'url("/auth-bg.png")',
        backgroundSize: 'cover',
        backgroundPositionX: '50%',
      }}
    ></Box>
  );
};

export default Background;
