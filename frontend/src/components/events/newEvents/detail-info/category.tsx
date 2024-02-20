import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { FormControl, FormLabel, MenuItem, Stack, Box } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type Category = {
  category_course: string;
};
type Props = {
  category: string;
  setCategory: (value: string) => void;
};
export default function Category({ category, setCategory }: Props) {
  //categories are from server
  const [categories, setCategories] = React.useState<Category[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/category`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }, []);

  return (
    <Stack
      direction='column'
      justifyContent='center'
      alignItems='flex-start'
      spacing={1}
      sx={{ width: '100%', fontSize: '1.25rem' }}
    >
      <FormControl fullWidth>
        <FormLabel
          id='category'
          sx={{ marginBlock: '.5rem', fontSize: '1.125rem' }}
        >
          Category {''}
          <Box component={'span'} sx={{ color: '#f14c4c' }}>
            *
          </Box>
        </FormLabel>
        <Select
          aria-labelledby='category'
          displayEmpty
          value={categories.length > 0 ? category : ''}
          onChange={(event: SelectChangeEvent) =>
            setCategory(event.target.value)
          }
        >
          <MenuItem value=''>
            <em>Please select a category</em>
          </MenuItem>
          {categories.map((category: Category, index: number) => (
            <MenuItem key={index} value={category.category_course}>
              {category.category_course}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
