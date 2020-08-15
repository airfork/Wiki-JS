import React, { useState } from "react";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

export default function REditor() {
  const [value, setValue] = useState(EditorState.createEmpty());
  const [markdown, setMarkdown] = useState("<h2>Nothing Here</h2>");

  const uploadCallback = async file => {
    return {}
  };

  const handleSubmit = () => {
    const rawContentState = convertToRaw(value.getCurrentContent());
    console.log(rawContentState);
    setMarkdown(draftToHtml(rawContentState));
  }

  return (
    <div>
      <Editor
        editorState={value}
        onEditorStateChange={setValue}
        uploadCallback={uploadCallback}
        editorStyle={{
          boxSizing: 'border-box',
          borderRadius: '2px',
          border: '1px solid #F1F1F1',
        }}
      />
      <button onClick={handleSubmit}>Submit</button>

      <div dangerouslySetInnerHTML={{ __html: markdown }} />
    </div>
  );
}