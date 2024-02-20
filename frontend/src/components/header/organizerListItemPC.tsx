import { useEffect, useContext } from 'react';
import { EventContext, initialState } from '@/context/eventContext';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@mui/material';

interface Page {
  label: string;
  path: string;
}

const organizerBtns: Page[] = [
  { label: 'Events', path: '/' || '/events?isPublished=true' },
  { label: 'My Events', path: '/user/my-events' },
  { label: 'History', path: '/history' },
  { label: 'Created Events', path: '/organizer-events' },
  { label: 'New Event', path: '/events/new' },
];

export default function OrganizerListItemPC() {
  const router = useRouter();
  const params = useParams();

  const { showedPage, setShowedPage, pathName, dispatch, setImage } =
    useContext(EventContext);

  // Update the currentPage when the path changes
  useEffect(() => {
    if (pathName !== '/user') {
      const page = organizerBtns.find((p) => p.path === pathName);
      if (page) {
        setShowedPage(page);
      }
    } else {
      setShowedPage(null);
    }
  }, [pathName]);

  const clickHandler = (path: string) => {
    router.push(path);
    if (path === '/events/new') {
      dispatch({ type: 'RESET', payload: initialState });
      setImage(null);
    }
  };
  return (
    <>
      {organizerBtns.map((button, index) => (
        <Button
          key={index}
          onClick={() => clickHandler(button.path)}
          variant={
            showedPage &&
            (showedPage.path === button.path ||
              showedPage?.path === '/events/?isUpdated=true' ||
              showedPage?.path === '/events/?isPublished=true' ||
              showedPage?.path === `/events/${params}/edit`)
              ? 'contained'
              : 'text'
          }
          color={
            showedPage &&
            (showedPage.path === button.path ||
              showedPage?.path === '/events/?isUpdated=true' ||
              showedPage?.path === '/events/?isPublished=true')
              ? 'primary'
              : 'secondary'
          }
          sx={{
            width: 'auto',
            padding: '2rem 1rem',
            borderRadius: 0,
          }}
        >
          {button.label}
        </Button>
      ))}
    </>
  );
}
