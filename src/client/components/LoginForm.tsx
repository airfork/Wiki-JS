import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { gql, useMutation } from '@apollo/client';
import { login as loginMutation, loginVariables } from '../graphql/login';
import {
  createAccount as createAccountMutation,
  createAccountVariables
} from '../graphql/createAccount';
import Snackbar from '@material-ui/core/Snackbar';
import Alert, { Color as AlertColor } from '@material-ui/lab/Alert';
import { useHistory } from 'react-router';
import useCountDown from 'react-countdown-hook';
import { useEffect } from 'react';
import { useMemo } from 'react';

export const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    logIn(username: $username, password: $password)
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation createAccount($username: String!, $password: String!) {
    createUser(user: {username: $username, password: $password}) {
      username
      admin
      token
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export type LoginFormProps = {
  signUp?: boolean,
}

export default function LoginForm(props: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [alertType, setAlertType] = useState<AlertColor>("success");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertAction, setAlertAction] = useState<null | React.ReactNode>(null);
  const [alertText, setAlertText] = useState("");

  const [timeLeft, { start, pause }] = useCountDown(5000, 1000);

  const [countingDown, setCountingDown] = useState(false);
  const [redirectTimeout, setRedirectTimeout] = useState<null | NodeJS.Timeout>(null);

  const history = useHistory();
  const historyAction = useMemo(() => (
    <Button color="inherit" size="small" onClick={() => {
      pause();
      history.push("/wiki");
    }}>
      Go Now
    </Button>
  ), [pause, history]);

  useEffect(() => {
    if (countingDown) {
      setAlertText(`Successfully made account. Redirecting to wiki in ${timeLeft / 1000}...`);
    }
  }, [countingDown, timeLeft]);

  const [login] = useMutation<loginMutation, loginVariables>(
    LOGIN_MUTATION,
    {
      onError(error) {
        setAlertText(error.message);
        setAlertType('error');
        setAlertOpen(true);
      },
      onCompleted({ logIn }) {
        localStorage.setItem('accessToken', logIn);
        history.push("/wiki");
      }
    }
  );
  const [createAccount] = useMutation<createAccountMutation, createAccountVariables>(
    CREATE_USER_MUTATION,
    {
      onError(error) {
        setAlertText(error.message);
        setAlertType('error');
        setAlertOpen(true);
      },
      onCompleted({ createUser }) {
        setCountingDown(true);
        setAlertType('success');
        setAlertAction(historyAction);
        start();
        localStorage.setItem('accessToken', createUser?.token ?? '');
        setRedirectTimeout(setTimeout(() => history.push("/wiki"), 5000));
        setAlertOpen(true);
      }
    }
  );

  let confirmError = false;
  if (props.signUp) {
    confirmError = confirmPassword != password;
  }
  const anyError = [confirmError].includes(true);
  const formDisabled = anyError || countingDown;

  const handleSubmitEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formDisabled) {
      return;
    }
    if (props.signUp) {
      createAccount({
        variables: {
          username,
          password,
        }
      });
    } else {
      login({
        variables: {
          username,
          password,
        },
      });
    }
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  }

  const handleAlertClose = (_: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  };

  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertType} variant="filled" action={alertAction}>
          {alertText}
        </Alert>
      </Snackbar>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {props.signUp ? "Sign Up" : "Login"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmitEvent}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            autoComplete="email"
            value={username}
            onInput={handleEmailChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required={true}
            fullWidth
            label="Password"
            type="password"
            id="password"
            value={password}
            onInput={handlePasswordChange}
            autoComplete="current-password"
          />
          {props.signUp
            ? <TextField
              variant="outlined"
              margin="normal"
              required={true}
              fullWidth
              error={confirmError}
              helperText={confirmError ? 'Must match password' : ''}
              label="Confirm Password"
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onInput={handleConfirmPasswordChange}
              autoComplete="current-password"
            />
            : null
          }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={formDisabled}
            className={classes.submit}
          >
            {props.signUp ? "Sign up" : "Login"}
          </Button>
          {props.signUp
            ? null
            : <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                  </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          }
        </form>
      </div>
    </Container>
  );
}