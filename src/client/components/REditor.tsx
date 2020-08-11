import React, { useState } from "react";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function REditor() {
  const [value, setValue] = useState('');


  return (
    <Editor
      editorState={value}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={setValue}
    />
  );
}