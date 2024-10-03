import React from 'react';
import Chip from '@mui/material/Chip';
import { Box } from '@mui/material';

type Props = {
  type: 'ENROLLED' | 'ATTENDED';
};

const ChipComponent = ({ type }: Props) => {
  return (
    <Box>
      {type === 'ENROLLED' ? (
        <Chip
          label='Enrolled'
          sx={{
            backgroundColor: '#CBE7D0',
            color: '#418B50',
            fontSize: '16px',
            fontWeight: 500,
            padding: '0px 8px',
          }}
        />
      ) : (
        <Chip
          label='Attended'
          sx={{
            backgroundColor: '#4F5B92',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 500,
            borderRadius: '6px',
          }}
        />
      )}
    </Box>
  );
};

export default ChipComponent;
