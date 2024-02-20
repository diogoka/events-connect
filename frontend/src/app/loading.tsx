import { CircularProgress } from '@mui/material'

export default function Loading() {
  return (
    <CircularProgress
      sx={{
        position: 'absolute',
        inset: '50vh auto auto 50%',
        zIndex: 10000
      }}
    />
  )
}
