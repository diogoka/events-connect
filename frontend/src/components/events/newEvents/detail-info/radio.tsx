import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { EventContext, Tag } from '@/context/eventContext';
import axios from 'axios';
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  SelectChangeEvent,
} from '@mui/material';

export default function RadioBtn() {
  const [radioTags, setRadioTags] = useState<Tag[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<number | null>(null);
  const { createdEvent, dispatch } = useContext(EventContext);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tags`)
      .then((res) => {
        setRadioTags(res.data);
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }, []);

  // Set selectedRadio based on createdEvent.modality when it exists
  useEffect(() => {
    if (createdEvent.modality) {
      setSelectedRadio(createdEvent.modality.id_tag);
    }
  }, [createdEvent.modality]);

  const handleChange = (event: SelectChangeEvent<typeof selectedRadio>) => {
    if (event.target.value) {
      const value = +event.target.value;
      setSelectedRadio(value);

      const selectedModality = radioTags.find((tag) => tag.id_tag === value);

      if (selectedModality) {
        dispatch({
          type: 'UPDATE_MODALITY',
          payload: {
            ...createdEvent,
            modality: selectedModality,
          },
        });
      }
    }
  };

  return (
    <FormControl>
      <FormLabel id='radio-buttons' sx={{ fontSize: '1.125rem' }}>
        Modality {''}
        <Box component={'span'} sx={{ color: '#f14c4c' }}>
          *
        </Box>
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby='radio-buttons'
        name='row-radio-buttons-group'
        value={selectedRadio}
        onChange={handleChange}
      >
        <FormControlLabel
          value={16}
          control={<Radio />}
          label='Online'
          checked={
            createdEvent &&
            createdEvent.modality &&
            createdEvent.modality.id_tag === 16
          }
        />
        <FormControlLabel
          value={17}
          control={<Radio />}
          label='In Person'
          checked={
            createdEvent &&
            createdEvent.modality &&
            createdEvent.modality.id_tag === 17
          }
        />
        <FormControlLabel
          value={18}
          control={<Radio />}
          label='Online and In Person'
          checked={
            createdEvent &&
            createdEvent.modality &&
            createdEvent.modality.id_tag === 18
          }
        />
      </RadioGroup>
    </FormControl>
  );
}
