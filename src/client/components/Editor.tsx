import React, { useState } from "react";
import 'react-quill/dist/quill.snow.css';

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

export default function Editor() {
  const [value, setValue] = useState('');

  return (
    <ReactQuill theme="snow" value={value} onChange={setValue} />
  );
}