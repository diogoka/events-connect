import React, {cloneElement} from 'react'
import { Box, Typography } from '@mui/material'

type Props = {
  icon: JSX.Element;
  value: string;
}

export default function UserInfoItem(props: Props) {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' columnGap='.5rem'>
      {cloneElement(props.icon, {style: { fontSize: '1.5rem', color: '#565656' }})}
      <Typography>{props.value}</Typography>
    </Box>
  )
}
