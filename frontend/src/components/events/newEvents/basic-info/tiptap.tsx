import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import './tiptapStyles.css';

const modules = {
  toolbar: [
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    ['link'],
  ],
};

interface EventProps {
  description_event: string;
}

type Props = {
  counter: number;
  value: string;
  onChange: (value: string) => void;
  rows: number;
};

const EventDescription = ({ counter, value, onChange, rows }: Props) => {
  const [createdEvent, setCreatedEvent] = useState<EventProps>({
    description_event: '',
  });

  const changeDesc = (
    value: string,
    delta: any,
    source: string,
    editor: any
  ) => {
    console.log(delta);
    console.log(source);
    console.log(editor);
    setCreatedEvent({ ...createdEvent, description_event: value });
    onChange(value);
  };

  return (
    <ReactQuill
      value={createdEvent.description_event}
      onChange={changeDesc}
      modules={modules}
      placeholder='Please enter description'
      style={{ height: '300px', width: '100%', marginBottom: '45px' }}
    />
  );
};

export default EventDescription;
