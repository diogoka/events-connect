import React from 'react'
import {
  TableCell,
  TableRow,
} from '@mui/material';

type Props = {
  title: string;
  content: string | JSX.Element;
}

export default function DetailInfoRow(props: Props) {  

  return (
    <TableRow
      key='price'
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell component='th' scope='row' sx={{
        backgroundColor: '#3874CB1A'
      }}>
        {props.title}
      </TableCell>
      <TableCell align='left'>
        {props.content}
      </TableCell>
    </TableRow>
  )
}
