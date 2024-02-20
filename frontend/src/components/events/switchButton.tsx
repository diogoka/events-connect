import React, { useState } from 'react';
import { Button, Box, Switch } from '@mui/material';

type Props = {
  setSwitchButtonState: (state: boolean) => void;
  titles: string[];
};

function SwitchButton({ setSwitchButtonState, titles }: Props) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setSwitchButtonState(event.target.checked);
  };

  const buttonClick = () => {
    setChecked(!checked);
    setSwitchButtonState(!checked);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        marginBottom: '1rem',
      }}
    >
      <Switch
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <Button
        variant={checked ? 'contained' : 'outlined'}
        onClick={buttonClick}
        sx={{
          color: checked ? 'white' : 'black',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          height: '2rem',
          minWidth: '11.5rem',
        }}
      >
        {titles[checked ? 0 : 1]}
      </Button>
    </Box>
  );
}

export default SwitchButton;
