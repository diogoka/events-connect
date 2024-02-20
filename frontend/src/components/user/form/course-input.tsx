'use client';
import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';

type Course = {
  id: number;
  name: string;
  category: string;
};

type Props = {
  courseId: string;
  setCourseId: (courseId: string) => void;
};

export default function CourseInput(props: Props) {
  const [courses, setCourses] = useState<Course[]>([]);

  // Get course data from server to show course names
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
      <InputLabel id='course'>Course</InputLabel>
      {courses.length > 0 && (
        <Select
          id='course'
          label='Course'
          value={props.courseId}
          defaultValue=''
          onChange={(e) => props.setCourseId(e.target.value)}
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
