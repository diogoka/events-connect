import { Box, Typography, Button, Divider } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'next/navigation';

import Image from 'next/image';

import InstagramIconSvg from '../../public/icons/instagramIcon.svg';
import FacebookIconSvg from '../../public/icons/facebookIcon.svg';
import PinterestIconSvg from '../../public/icons/pinterestIcon.svg';
import YouTubeIconSvg from '../../public/icons/youtubeIcon.svg';
import LinkedInIconSvg from '../../public/icons/linkedinIcon.svg';
import TikTokIconSvg from '../../public/icons/tiktokIcon.svg';
import ListItemFooter from './Footer/ListItem/ListIem';

import arrowIconSvg from '../../public/icons/arrowIconSvg.svg';

type Props = {
  laptopQuery: boolean;
};

export default function Footer({ laptopQuery }: Props) {
  const pathname = usePathname();

  return (
    <Box
      component='footer'
      textAlign='center'
      sx={{
        backgroundColor: '#4F5B92',
        padding: laptopQuery ? '40px 104px' : '40px 24px',
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
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Image src={arrowIconSvg} alt='arrow icon' width={20} height={20} />
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
                justifyContent: laptopQuery ? 'flex-start' : 'space-between',
                rowGap: laptopQuery ? '0' : '20px',
                columnGap: laptopQuery ? '16px' : '0',
              }}
            >
              <ListItem sx={{ width: 'fit-content', columnGap: '16px' }}>
                <ListItemButton href='/events'>Home</ListItemButton>
                <ListItemButton href='/user/my-events'>
                  My Events
                </ListItemButton>
              </ListItem>

              <ListItem sx={{ width: 'fit-content', columnGap: '16px' }}>
                <ListItemButton href='https://www.google.com.br'>
                  Profile
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
          <Box
            sx={{
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
                justifyContent: laptopQuery ? 'flex-start' : 'space-between',
                alignItems: 'start',
                rowGap: laptopQuery ? '0' : '20px',
                columnGap: laptopQuery ? '24px' : '0',
              }}
            >
              <ListItemFooter
                alt='intagram icon'
                src={InstagramIconSvg}
                size={24}
                href='https://www.instagram.com/cicccvancouver/'
                width={laptopQuery ? 'fit-content' : '30%'}
              />

              <ListItemFooter
                alt='facebook icon'
                src={FacebookIconSvg}
                size={24}
                href='https://www.facebook.com/cicccvancouver/'
                width={laptopQuery ? 'fit-content' : '30%'}
              />

              <ListItemFooter
                alt='pinterest icon'
                src={PinterestIconSvg}
                size={24}
                href='https://www.pinterest.ca/cicccvancouver/'
                width={laptopQuery ? 'fit-content' : '30%'}
              />

              <ListItemFooter
                alt='youtube icon'
                src={YouTubeIconSvg}
                size={24}
                href='https://www.youtube.com/channel/UCDj9ILg0V9aAF0NxCVDUlww'
                width={laptopQuery ? 'fit-content' : '30%'}
              />

              <ListItemFooter
                alt='linkedin icon'
                src={LinkedInIconSvg}
                size={24}
                href='https://www.linkedin.com/school/cornerstone-international-community-college-of-canada/'
                width={laptopQuery ? 'fit-content' : '30%'}
              />

              <ListItemFooter
                alt='tiktok icon'
                src={TikTokIconSvg}
                size={24}
                href='https://www.tiktok.com/@cicccvancouver/'
                width={laptopQuery ? 'fit-content' : '30%'}
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
