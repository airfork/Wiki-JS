import React, { useState } from "react";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import SaveIcon from '@material-ui/icons/Save';
import { Fab, FormGroup } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { gql, useMutation } from "@apollo/client";
import { createPost, createPostVariables } from "../graphql/createPost";
import { generate } from "shortid";
import { useHistory } from "react-router";
import Routes from "../routes";
import { uploadImage, uploadImageVariables } from "../graphql/uploadImage";

const CREATE_POST = gql`
  mutation createPost($title: String!, $contents: String!) {
    createPage(page: {
      title: $title,
      contents: $contents,
    }) {
      adminOnly
      categories {
        category
      }
      contents
      contributors {
        username
      }
      title
      createdAt
      updatedAt
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation uploadImage($file: Upload!) {
    createImage(image: $file) {
      id
      url
    }
  }
`;

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

  const [title, setTitle] = useState(generate());
  const [value, setValue] = useState(EditorState.createEmpty());
  const [markdown, setMarkdown] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const history = useHistory();
  const [createPost] = useMutation<createPost, createPostVariables>(CREATE_POST, {
    onCompleted: ({ createPage }) => {
      if (createPage != null) {
        history.push(`${Routes.wiki.path}/${createPage.title}`);
      }
    }
  });
  const [uploadImage] = useMutation<uploadImage, uploadImageVariables>(UPLOAD_IMAGE);
  const uploadCallback = async (file: File) => {
    const newImage = await uploadImage({
      variables: {
        file,
      }
    });
    return {
      data: {
        link: newImage.data?.createImage?.url
      }
    }
  };
  const savePost = () => {
    const rawContentState = convertToRaw(value.getCurrentContent());
    createPost({
      variables: {
        contents: draftToHtml(rawContentState),
        title,
      }
    });
  };

  const handleSlideChange = () => {
    if (isPreview) {
      setIsPreview(false);
    } else {
      setIsPreview(true);

      const rawContentState = convertToRaw(value.getCurrentContent());
      setMarkdown(draftToHtml(rawContentState));
    }
  }

  return (
    <div className={classes.editor}>
      <FormGroup row>
        <FormControlLabel
          control={<Switch name="checkedA" checked={isPreview} onChange={handleSlideChange} />}
          label={isPreview ? 'View Editor' : 'Preview Output'}
        />
      </FormGroup>
      {isPreview
        ? <div dangerouslySetInnerHTML={{ __html: markdown }} />
        : <>
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
          <Fab
            className={classes.fab}
            color="secondary"
            aria-label="add"
            onClick={savePost}>
            <SaveIcon />
          </Fab>
        </>
      }
    </div>
  );
}