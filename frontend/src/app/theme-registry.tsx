'use client';
import { useState } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { GlobalStyles, alpha } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

let theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face {
        font-family: 'Roboto';
      }
      `,
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: 5,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '18px',
          color: '#666666',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 5,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          fontSize: '18px',
          height: '48px',
          padding: 0,
          borderRadius: 5,
          textTransform: 'none',
        },
      },
    },
  },
  palette: {
    primary: {
      light: alpha('#3875CB', 0.1),
      main: '#141D4F',
      dark: '#070F3D',
      contrastText: '#fff',
    },
    secondary: {
      light: '#CCCCCC',
      main: '#333333',
      dark: '#000000',
      contrastText: '#fff',
    },
    info: {
      light: '#accbf6',
      main: '#3874CB',
      dark: '#1053b1',
      contrastText: '#fff',
    },
    error: {
      light: '#f14c4c',
      main: '#D00000',
      dark: '#970303',
      contrastText: '#fff',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,
      md: 769,
      lg: 1200,
      xl: 1536,
    },
  },
});

theme.typography.h1.fontSize = '24px';
theme.typography.h1.fontWeight = 500;
theme.typography.h1.color = theme.palette.primary.main;
theme.typography.h1.marginBlock = '10px';
theme.typography.h1.textAlign = 'center';
theme.typography.h2.fontSize = '18px';
theme.typography.body1.color = theme.palette.secondary.main;
theme.typography.body2.fontSize = '14px';

export default function ThemeRegistry(props: any) {
  const { options, children } = props;

  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{ input: { padding: 0 } }} />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
