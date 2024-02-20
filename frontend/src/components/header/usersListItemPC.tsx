import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@mui/material';

interface Page {
  label: string;
  path: string;
}

const usersBtns: Page[] = [
  { label: 'Events', path: '/' },
  { label: 'My Events', path: '/user/my-events' },
  { label: 'History', path: '/history' },
];

export default function UsersListItemPC() {
  const router = useRouter();
  const pathName = usePathname();
  const [currentPage, setCurrentPage] = useState<Page | null>(usersBtns[0]);

  // Update the currentPage when the path changes
  useEffect(() => {
    const page = usersBtns.find((p) => p.path === pathName);
    if (page) {
      setCurrentPage(page);
    }
  }, [pathName]);

  const clickHandler = (path: string) => {
    router.push(path);
  };
  return (
    <>
      {usersBtns.map((button, index) => (
        <Button
          key={index}
          onClick={() => clickHandler(button.path)}
          variant={
            currentPage && currentPage.path === button.path
              ? 'contained'
              : 'text'
          }
          color={
            currentPage && currentPage.path === button.path
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
