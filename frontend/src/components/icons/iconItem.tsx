'use client';
import { IconContext } from 'react-icons';
import * as IconLibrary from 'react-icons/fa';
import { Box } from '@mui/material';

interface Props {
  iconName: string;
  size?: string;
  color?: string;
  onClick?: (event: React.MouseEvent) => void;
  isClickable: boolean;
  iconHoverColor?: string;
}

function IconItem({ iconName, size, color, onClick, isClickable }: Props) {
  const IconStyle = {
    cursor: 'pointer  ',
    backgroundColor: 'inherit',
    '&:hover': {
      backgroundColor: 'none',
    },
    display: 'flex',
    alignItems: 'baseline',
  };

  const SelectedIcon = IconLibrary[iconName];
  if (!SelectedIcon) return null;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isClickable && onClick) {
      onClick(event);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={IconStyle}
      style={{
        background: 'none',
        display: 'flex',
        alignItems: 'baseline',
        padding: '0',
      }}
    >
      <IconContext.Provider value={{ color: color, size: size || '1rem' }}>
        <SelectedIcon />
      </IconContext.Provider>
    </Box>
  );
}

export default IconItem;
