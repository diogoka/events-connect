import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress
        sx={{
          position: 'absolute',
          zIndex: 10000,
        }}
      />
    </Box>
  );
}
