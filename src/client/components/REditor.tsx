import React, { useState } from "react";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import SaveIcon from '@material-ui/icons/Save';
import { Fab, FormGroup } from "@material-ui/core";
import { createStyles, fade, makeStyles, Theme } from "@material-ui/core/styles";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    },
    editor: {
      paddingTop: "2rem"
    }
  }),
);

export default function REditor() {
  const classes = useStyles();

  const [value, setValue] = useState(EditorState.createEmpty());
  const [markdown, setMarkdown] = useState("<h2>Nothing Here</h2>");
  const [preview, setPreview] = useState({
    isPreview: false,
    sliderText: 'Preview Output'
  })

  const uploadCallback = async file => {
    return {}
  };

  const handleSlideChange = () => {
    if (preview.isPreview) {
      setPreview({
        ...preview,
        isPreview: false,
        sliderText: 'Preview Output'
      });
    } else {
      setPreview({
        ...preview,
        isPreview: true,
        sliderText: 'View Editor'
      });

      const rawContentState = convertToRaw(value.getCurrentContent());
      setMarkdown(draftToHtml(rawContentState));
    }
  }

  return (
    <div className={classes.editor}>
      <FormGroup row>
        <FormControlLabel
          control={<Switch name="checkedA" checked={preview.isPreview} onChange={handleSlideChange} />}
          label={preview.sliderText}
        />
      </FormGroup>
      {preview.isPreview
        ? <div dangerouslySetInnerHTML={{ __html: markdown }} />
        : <div>
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

          <Fab className={classes.fab} color="secondary" aria-label="add" onClick={() => console.log("🍆💦")}>
            <SaveIcon />
          </Fab>
        </div>
      }
    </div>
  );
}