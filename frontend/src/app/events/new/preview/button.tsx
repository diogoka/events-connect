import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import ThreeDots from '@/components/animation/theeDots';

type Props = {
  forMobile: boolean;
  eventId: number;
  submitEventHandler: (id: number) => void;
  isDisabled: boolean;
};

export default function ButtonsForPreview({
  forMobile,
  eventId,
  submitEventHandler,
  isDisabled,
}: Props) {
  const router = useRouter();
  const buttonWidth = { width: forMobile ? '47%' : '200px' };
  const message: string =
    eventId > 0
      ? isDisabled
        ? 'Updating'
        : 'Update'
      : isDisabled
      ? 'Creating'
      : 'Create';

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
          disabled={isDisabled}
          onClick={() => submitEventHandler(eventId)}
        >
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            {message}

            {isDisabled && <ThreeDots />}
          </Box>
        </Button>
      </Box>
    </Box>
  );
}
