import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ButtonsForPreview({
  forMobile,
  eventId,
  submitEventHandler,
}: {
  forMobile: boolean;
  eventId: number;
  submitEventHandler: (id: number) => void;
}) {
  const router = useRouter();

  const buttonWidth = { width: forMobile ? '47%' : '200px' };
  return (
    <Box
      display='flex'
      justifyContent={forMobile ? 'space-between' : 'center'}
      sx={{ marginBlock: forMobile ? '25px' : '15px' }}
    >
      <Box style={buttonWidth} marginRight={forMobile ? 0 : '50px'}>
        <Button
          type='submit'
          variant='outlined'
          color='primary'
          fullWidth
          onClick={() => {
            router.push(
              eventId > 0
                ? `/events/${eventId}/edit`
                : '/events/new?preview=true'
            );
          }}
        >
          Edit
        </Button>
      </Box>

      <Box style={buttonWidth}>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          onClick={() => submitEventHandler(eventId)}
        >
          {eventId > 0 ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
}
