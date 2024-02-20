'use client';
import { Box, Stack, Typography } from '@mui/material';
import IconItem from '@/components/icons/iconItem';

type Props = {
  icons: {
    name: string;
    isClickable: boolean;
    color: string;
    title?: string;
    size?: string;
    hoverColor?: string;
  }[];
  onIconClick?: (iconName: string) => void;
};

function IconsContainer({ icons, onIconClick }: Props) {
  const handleClick = (iconName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const icon = icons.find((icon) => icon.name === iconName);
    if (icon && icon.isClickable) {
      onIconClick!(iconName);
    }
  };

  return (
    <Stack
      direction='row'
      spacing={1}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}
    >
      {icons.map((icon, index) => {
        return (
          <Box
            key={index}
            onClick={(event) => handleClick(icon.name, event)}
            sx={{
              display: 'flex',
              borderRadius: '5px',
              cursor: 'pointer',
              alignItems: 'normal',
              columnGap: '0.3rem',
              padding: '0.3rem',
              '&:hover': {
                backgroundColor: icon.hoverColor,
              },
            }}
          >
            <IconItem
              iconName={icon.name}
              isClickable={icon.isClickable}
              color={icon.color}
              iconHoverColor={icon.hoverColor}
              size={icon.size}
              onClick={(event) => handleClick(icon.name, event)}
            />
            {icon.title && (
              <Typography variant='caption'>{icon.title}</Typography>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

export default IconsContainer;
