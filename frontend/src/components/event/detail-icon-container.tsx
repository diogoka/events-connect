import { useContext } from 'react';
import { Box } from '@mui/material';

import IconsContainer from '../icons/iconsContainer';
import { UserContext } from '@/context/userContext';
import { Props } from './detail-container';

const DetailIconContainer = ({
  otherInfo,
  applied,
  organizerEvent,
  forPreview,
  setIsAlertVisible,
  handleAlertFn,
}: Props) => {
  const { loginStatus } = useContext(UserContext);

  const handleUserClick = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(`${currentURL}`)
      .then(() => {
        handleAlertFn!(
          true,
          'URL Copied',
          'The Event URL has been copied to your clipboard.',
          'success'
        );

        setTimeout(() => {
          handleAlertFn!(false, '', '', 'success');
        }, 3000);
      })
      .catch((err) => {
        console.error('Failed to copy URL: ', err);
      });
  };

  return (
    <Box
      display={loginStatus == 'Logged In' ? 'flex' : 'none'}
      justifyContent='space-between'
      visibility={forPreview ? 'hidden' : 'visible'}
    >
      <Box
        visibility={applied && !organizerEvent ? 'visible' : 'hidden'}
        display='flex'
        alignItems='center'
      >
        <IconsContainer
          icons={[
            { name: 'FaCheckSquare', isClickable: false, color: 'green' },
          ]}
          onIconClick={() => {
            return;
          }}
        />
        <Box sx={{ display: 'inline', marginTop: '3px' }}>Applied</Box>
      </Box>
      <Box>
        <IconsContainer
          icons={[
            { name: 'FaShareSquare', isClickable: true, color: '#333333' },
          ]}
          onIconClick={handleUserClick}
        />
      </Box>
    </Box>
  );
};

export default DetailIconContainer;
