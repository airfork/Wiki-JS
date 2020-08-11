import React, { useState } from "react";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function REditor() {
  const [value, setValue] = useState(EditorState.createEmpty());

  const uploadCallback = async file => {
    return {}
  };

  return (
    <Editor
      editorState={value}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={setValue}
      uploadCallback={uploadCallback}
    />
  );
}