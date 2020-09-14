import React from "react";
import { Fab, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useQuery } from "@apollo/client";
import { isLoggedIn } from "../graphql/isLoggedIn";
import { IS_LOGGED_IN } from "../auth";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  fab: {
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
}));

export default function CreateFab() {
  const classes = useStyles();
  const { data: userData} = useQuery<isLoggedIn>(IS_LOGGED_IN);
  const history = useHistory();
  const fabDisabled = !userData?.isLoggedIn ?? true;

  if (fabDisabled) {
    return null;
  }

  return(
    <Tooltip title={"Create page"}>
      <Fab
        color="secondary"
        className={classes.fab}
        onClick={() => history.push("/wiki/create")}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  )
}