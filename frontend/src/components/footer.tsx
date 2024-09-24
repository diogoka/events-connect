'use client';
import { useMediaQuery, Box, Typography, Button, Divider } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { usePathname } from 'next/navigation';

import Image from 'next/image';
import GoogleIcon from './icons/googleIcon';

import InstagramIconSvg from '../../public/icons/instagramIcon.svg';
import FacebookIconSvg from '../../public/icons/facebookIcon.svg';
import PinterestIconSvg from '../../public/icons/pinterestIcon.svg';
import YouTubeIconSvg from '../../public/icons/youtubeIcon.svg';
import LinkedInIconSvg from '../../public/icons/linkedinIcon.svg';
import TikTokIconSvg from '../../public/icons/tiktokIcon.svg';
import ListItemFooter from './Footer/ListItem/ListIem';

export default function Footer() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const pathname = usePathname();
  const isFooterRight = pathname === '/signup' && !isMobile;
  const isFooterWhite = pathname === '/login' && !isMobile;

  return (
    <Box
      component='footer'
      width={isFooterRight ? '50%' : '100vw'}
      minWidth={isFooterRight ? '560px' : 'auto'}
      maxWidth={isFooterRight ? '960px' : 'auto'}
      position='absolute'
      right={0}
      zIndex={200}
      textAlign='center'
      sx={{
        transform: 'translateY(-100%)',
        backgroundColor: '#4F5B92',
        minHeight: '430px',
        padding: '40px 24px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Image
            src='/white-logo.svg'
            alt='cornerstone-connect logo'
            width={600}
            height={600}
            priority={true}
            style={{ width: '155.60px', height: 'auto' }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            sx={{
              backgroundColor: '#DDE1FF',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onClick={() => {}}
          >
            <GoogleIcon name='arrow_upward' size={20} />
            Back to top
          </Button>
        </Box>
      </Box>

      <Divider
        sx={{
          margin: '40px 0',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          height: '1px',
        }}
      />

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              width: '50%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Typography color={'white'} sx={{ textAlign: 'start' }}>
              Links
            </Typography>
            <List
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                rowGap: '20px',
              }}
            >
              <ListItem sx={{ width: '50%' }}>
                <ListItemButton href='/events'>Home</ListItemButton>
              </ListItem>

              <ListItem sx={{ width: '50%' }}>
                <ListItemButton href='/user/my-events'>
                  My Events
                </ListItemButton>
              </ListItem>

              <ListItem sx={{ width: '50%' }}>
                <ListItemButton href='https://www.google.com.br'>
                  History
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ width: '50%' }}>
                <ListItemButton href='https://www.google.com.br'>
                  Profile
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
          <Box
            sx={{
              width: '42%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Typography color={'white'} sx={{ textAlign: 'start' }}>
              Follow Cornerstone
            </Typography>
            <List
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'start',
                rowGap: '20px',
              }}
            >
              <ListItemFooter
                alt='intagram icon'
                src={InstagramIconSvg}
                size={24}
                href='https://www.instagram.com/cicccvancouver/'
              />

              <ListItemFooter
                alt='facebook icon'
                src={FacebookIconSvg}
                size={24}
                href='https://www.facebook.com/cicccvancouver/'
              />

              <ListItemFooter
                alt='pinterest icon'
                src={PinterestIconSvg}
                size={24}
                href='https://www.pinterest.ca/cicccvancouver/'
              />

              <ListItemFooter
                alt='youtube icon'
                src={YouTubeIconSvg}
                size={24}
                href='https://www.youtube.com/channel/UCDj9ILg0V9aAF0NxCVDUlww'
              />

              <ListItemFooter
                alt='linkedin icon'
                src={LinkedInIconSvg}
                size={24}
                href='https://www.linkedin.com/school/cornerstone-international-community-college-of-canada/'
              />

              <ListItemFooter
                alt='tiktok icon'
                src={TikTokIconSvg}
                size={24}
                href='https://www.tiktok.com/@cicccvancouver/'
              />
            </List>
          </Box>
        </Box>
      </Box>

      <Typography sx={{ marginTop: '40px', color: 'white' }}>
        ©️ 2024 Cornerstone Connect All Rights Reserved. Design by Thifany
        Brito. Developed by Diogo Almeida.{' '}
      </Typography>
    </Box>
  );
}
