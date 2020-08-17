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

export const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    logIn(username: $username, password: $password)
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

type LoginFormProps = {
  signUp?: boolean,
}

export default function LoginForm(props: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [login] = useMutation<loginMutation, loginVariables>(
    LOGIN_MUTATION,
    {
      onError(error) {
        console.log(error);
      },
      onCompleted({ logIn }) {
        localStorage.setItem('accessToken', logIn);
        console.log(logIn);
      }
    }
  );
  const confirmError = confirmPassword != '' && confirmPassword != password;

  const handleSubmitEvent = event => {
    event.preventDefault();
    login({
      variables: {
        username: username,
        password,
      },
    });
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

  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmitEvent}>
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
                <Link href="#" variant="body2">
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