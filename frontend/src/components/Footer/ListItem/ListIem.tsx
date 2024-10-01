import React from 'react';

import Image from 'next/image';

import { ListItem } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';

type Props = {
  href: string;
  alt: string;
  src: string;
  size: number;
  width: string;
};

const ListItemFooter = ({ href, src, alt, size, width }: Props) => {
  return (
    <ListItem
      sx={{
        // width: '30%',
        width: width,
      }}
    >
      <ListItemButton href={href} target='_blank' sx={{ width: '20px' }}>
        <ListItemIcon
          sx={{
            display: 'flex',

            alignItems: 'center',
          }}
        >
          <Image src={src} alt={alt} width={size} height={size} />
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  );
};

export default ListItemFooter;
