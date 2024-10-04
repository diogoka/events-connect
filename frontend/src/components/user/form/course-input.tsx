'use client';
import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { Course } from '@/types/components.types';
import { UserInputForm } from '@/types/pages.types';

type Props = {
  courseId: string;
  setCourse: <K extends keyof UserInputForm>(
    key: K,
    value: UserInputForm[K]
  ) => void;
  disabled: boolean;
  type: keyof UserInputForm;
};

export default function CourseInput(props: Props) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses`)
      .then((res) => {
        setCourses(res.data);
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }, []);

  return (
    <FormControl required fullWidth>
      {courses.length > 0 && (
        <Select
          id='course'
          value={props.courseId}
          defaultValue=''
          onChange={(e) => props.setCourse(props.type, e.target.value)}
          disabled={props.disabled}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            backgroundColor: '#F5F2FA',
            borderRadius: '6px',
          }}
        >
          {courses.map((course: Course, index: number) => {
            return (
              <MenuItem key={index} value={course.id}>
                {course.name}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </FormControl>
  );
}
