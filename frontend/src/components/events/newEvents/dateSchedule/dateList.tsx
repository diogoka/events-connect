import React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Grid, Box, Stack, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { hourOfToday, endHourOfToday } from '@/context/eventContext';
interface DateRange {
  dateStart: dayjs.Dayjs;
  dateEnd: dayjs.Dayjs;
}

type Props = {
  dates: DateRange[];
  setDates: (dates: DateRange[]) => void;
  isMobile: boolean;
};

export default function DateList({ dates, setDates }: Props) {
  const deleteDateBtnHandler = (index: number) => {
    const updatedDate = dates.filter((date, i) => {
      return i !== index;
    });
    setDates(updatedDate);
  };

  const addDateBtnHandler = () => {
    setDates([...dates, { dateStart: hourOfToday, dateEnd: endHourOfToday }]);
  };

  const updateDateHandler = (
    index: number,
    newDateStart: dayjs.Dayjs,
    newDateEnd: dayjs.Dayjs
  ) => {
    const updatedDates = [...dates];
    updatedDates[index] = {
      dateStart: newDateStart,
      dateEnd: newDateEnd,
    };
    setDates(updatedDates);
  };

  return (
    <>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        spacing={1}
        sx={{
          width: '100%',
        }}
      >
        <Typography variant='h2' sx={{ fontWeight: 400, lineHeight: '26px' }}>
          Date {''}
          <Box component={'span'} sx={{ color: '#f14c4c' }}>
            *
          </Box>
        </Typography>
        <Button
          onClick={addDateBtnHandler}
          startIcon={<AddCircleOutlineIcon />}
          size='medium'
          variant='text'
          color='info'
          sx={{
            height: 'auto',
            '&:hover': { background: 'none' },
          }}
        >
          Recurring Date
        </Button>
      </Stack>
      <Stack
        id='date'
        width='100%'
        alignItems='center'
        rowGap='.5rem'
        marginTop='0!important'
      >
        {dates.map((date, index) => (
          <Box
            key={index}
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            marginTop='8px!important'
            sx={{
              width: '100%',
            }}
          >
            <Grid
              container
              justifyContent='center'
              alignItems='center'
              rowSpacing={1}
              columnSpacing={{ md: 2 }}
            >
              <Grid item sm={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    disablePast
                    label={`Start Date ${index + 1}`}
                    value={date.dateStart}
                    onChange={(newDateStart) => {
                      newDateStart
                        ? updateDateHandler(index, newDateStart, date.dateEnd)
                        : null;
                    }}
                    sx={{
                      width: '100%',
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item sm={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    disablePast
                    label={`End Date ${index + 1}`}
                    value={date.dateEnd}
                    minDateTime={date.dateStart}
                    onChange={(newDateEnd) => {
                      newDateEnd
                        ? updateDateHandler(index, date.dateStart, newDateEnd)
                        : null;
                    }}
                    sx={{
                      width: '100%',
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            {dates.length > 1 && (
              <Button
                onClick={() => deleteDateBtnHandler(index)}
                color='secondary'
                variant='text'
                startIcon={<RemoveCircleOutlineIcon />}
                size='medium'
                sx={{
                  height: 'auto',
                  '&:hover': { background: 'none' },
                }}
              >
                Delete Date
              </Button>
            )}
          </Box>
        ))}
      </Stack>
    </>
  );
}
