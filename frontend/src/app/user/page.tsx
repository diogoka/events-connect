'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Button, Chip, Avatar } from '@mui/material';
import { UserContext } from '@/context/userContext';
import { PageContext, PageStatus } from '@/context/pageContext';
import { BsFillPersonFill } from 'react-icons/bs';
import { HiMail } from 'react-icons/hi';
import { IoIosSchool } from 'react-icons/io';
import UserInfoItem from '@/components/user/user-info-item';
import { useMediaQuery } from '@mui/material';

export default function UserPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const router = useRouter();

  const { user, firebaseAccount } = useContext(UserContext);
  const { setPageStatus } = useContext(PageContext);

  useEffect(() => {
    setPageStatus(PageStatus.Ready);
  });

  return (
    <Stack width='100%' paddingBlock='4rem'>
      <Stack alignItems='center' rowGap='1rem'>
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
          icon={<BsFillPersonFill />}
          value={user ? `${user!.firstName + ' ' + user!.lastName}` : ''}
        />
        <UserInfoItem icon={<HiMail />} value={user ? user!.email : ''} />
        <UserInfoItem
          icon={<IoIosSchool />}
          value={user ? user!.courseName : ''}
        />

        <Button
          variant='contained'
          sx={{ width: '7.5rem' }}
          onClick={() => router.push('/user/edit')}
        >
          Edit
        </Button>
      </Stack>
    </Stack>
  );
}
