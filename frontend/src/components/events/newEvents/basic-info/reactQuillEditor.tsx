import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './reactQuillEditorStyles.css';

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
  onChange: (value: string) => void;
};

const ReactQuillEditor = ({ onChange }: Props) => {
  const [createdEvent, setCreatedEvent] = useState<EventProps>({
    description_event: '',
  });

  const changeDesc = (value: string) => {
    setCreatedEvent({ ...createdEvent, description_event: value });
    onChange(value);
  };

  return (
    <ReactQuill
      value={createdEvent.description_event}
      onChange={changeDesc}
      modules={modules}
      placeholder='Please enter the event description'
      style={{
        height: '300px',
        width: '100%',
        marginBottom: '45px',
        fontStyle: 'normal',
        fontSize: '16px',
      }}
    />
  );
};

export default ReactQuillEditor;
