import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';
import { agreement } from './agreement';

type Props = {
  openModal: boolean;
  handleClose: () => void;
};

const ModalAgreement = ({ openModal, handleClose }: Props) => {
  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const modalContentStyle = {
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    width: '700px',
    borderRadius: '5px',
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '80vh',
  };

  const closeButtonStyle = {
    padding: 0,
    fontWeight: '700',
    minHeight: '0px',
    height: '0px',
    position: 'absolute',
    top: '-24%',
    left: '96%',
  };

  const headerModalStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyle = {
    fontWeight: '700',
  };

  return (
    <>
      <Modal open={openModal} onClose={handleClose} style={modalStyle}>
        <Box sx={modalContentStyle}>
          <Box sx={headerModalStyle}>
            <Typography sx={titleStyle}>Terms and Conditions</Typography>
            <Button onClick={handleClose} sx={closeButtonStyle}>
              X
            </Button>
          </Box>
          <Box>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: '14px',
                fontFamily: 'inherit',
                textAlign: 'justify',
                wordBreak: 'break-word',
              }}
            >
              {agreement}
            </pre>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ModalAgreement;
