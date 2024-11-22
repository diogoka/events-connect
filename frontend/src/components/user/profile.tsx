'use client';
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Chip, Avatar, Box, Typography } from '@mui/material';
import { UserContext } from '@/context/userContext';
import { PageContext } from '@/context/pageContext';
import { PageStatus } from '@/types/context.types';
import UserInfoItem from '@/components/user/user-info-item';
import { useMediaQuery } from '@mui/material';

import mailIconSvg from '../../../public/icons/mailIcon.svg';
import graduationIconSvg from '../../../public/icons/graduationIconSvg.svg';
import editIconSvg from '../../../public/icons/editIcon.svg';
import Image from 'next/image';

type Props = {};

const Profile = (props: Props) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const router = useRouter();

  const { user, firebaseAccount } = useContext(UserContext);
  const { setPageStatus } = useContext(PageContext);

  useEffect(() => {
    setPageStatus(PageStatus.Ready);
  });
  return (
    <>
      <Stack
        alignItems='center'
        rowGap='24px'
        sx={{
          backgroundColor: 'white',
          borderRadius: '6px',
          padding: '24px',
          position: 'relative',
        }}
      >
        <Avatar
          src={`${
            user?.provider === 'password'
              ? user.avatarURL
              : firebaseAccount?.photoURL
          }`}
          alt={user?.firstName}
          sx={{
            width: isMobile ? '7.5rem' : '10rem',
            height: isMobile ? '7.5rem' : '10rem',
            fontSize: isMobile ? '3rem' : '4rem',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            paddingRight: '24px',
            paddingTop: '24px',
            backgroundColor: 'transparent',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
          component={'button'}
          onClick={() => router.push('/user/edit')}
        >
          <Image src={editIconSvg} width={24} height={24} alt='edit icon' />
          <Typography
            sx={{ fontSize: '18px', fontWeight: 500, color: '#4F5B92' }}
          >
            Edit
          </Typography>
        </Box>

        {user?.roleName !== 'student' && (
          <Chip
            label={user?.roleName}
            variant='filled'
            color='error'
            sx={{
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}
          />
        )}

        <UserInfoItem
          value={user ? `${user!.firstName + ' ' + user!.lastName}` : ''}
          type='TITLE'
        />
        <UserInfoItem
          src={graduationIconSvg}
          value={user ? user!.courseName : ''}
          size='LARGE'
        />
        <UserInfoItem src={mailIconSvg} value={user ? user!.email : ''} />
      </Stack>
    </>
  );
};

export default Profile;
