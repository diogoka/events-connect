'use client'
import { useMediaQuery, Box, Typography } from '@mui/material'
import { usePathname } from 'next/navigation';

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
        transform: 'translateY(-100%)'
      }}>
      <Typography
        color={isFooterWhite ? 'white' : '#666666'}
        fontSize='.75rem'
        align='center'
      >
        ©️ 2023 Eventllege All Rights Reserved.
      </Typography>
    </Box>
  )
}