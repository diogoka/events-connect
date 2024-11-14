import React from 'react';
import { Box, Button, Input, Typography } from '@mui/material';
import Image from 'next/image';
import CollectionsIcon from '@mui/icons-material/Collections';

type Props = {
  warning: string;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile: boolean;
  tempImage: string;
  imageURL: string;
};

export default function ImageContainer({
  warning,
  onFileInputChange,
  isMobile,
  tempImage,
  imageURL,
}: Props) {
  const renderImage = (imgTemporary: string, imgURL: string) => {
    if (imgTemporary || imgURL) {
      return (
        <Box sx={{ width: '100%' }}>
          <Image
            src={imgTemporary ? imgTemporary : imgURL}
            alt=''
            width={380}
            height={220}
            style={{
              objectFit: 'cover',
              objectPosition: 'top',
              width: '100%',
            }}
          />
        </Box>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      {renderImage(tempImage, imageURL)}
      <Button
        component='label'
        variant='contained'
        startIcon={<CollectionsIcon />}
        color='info'
        fullWidth
        sx={{
          width: '100%',
        }}
      >
        {tempImage || imageURL ? 'Edit Image' : 'Add Image'}
        <Input
          type='file'
          onChange={onFileInputChange}
          sx={{
            clip: 'rect(0 0 0 0)',
            clipPath: 'inset(50%)',
            height: 1,
            overflow: 'hidden',
            position: 'absolute',
            bottom: 0,
            left: 0,
            whiteSpace: 'nowrap',
            width: 1,
            accept: 'image/*',
          }}
        />
      </Button>

      <Typography
        sx={{ color: 'red', fontSize: '0.75rem' }}
        style={{ marginTop: '10px' }}
      >
        For optimal quality, it is advised to utilize the aspect ratio 19:11.
      </Typography>

      <Typography variant={'body2'}>{warning}</Typography>
    </>
  );
}
