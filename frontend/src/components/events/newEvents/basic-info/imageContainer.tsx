import React from 'react';
import { Button, Input, Typography } from '@mui/material';
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
        <Image
          src={imgTemporary ? imgTemporary : imgURL}
          alt=''
          width={320}
          height={220}
          style={{
            objectFit: 'cover',
          }}
        />
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
        variant='outlined'
        startIcon={<CollectionsIcon />}
        color='info'
        fullWidth
        sx={{
          width: isMobile ? '100%' : '40%',
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
      <Typography variant={'body2'}>{warning}</Typography>
    </>
  );
}
