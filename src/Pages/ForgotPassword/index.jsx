import { Button, Grid, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SignBanner from '../../Components/Reusable/SignBanner';
import Modal from '../../Components/Reusable/Modal';
import { images } from '../../assets';
import CssTextField from '../../Components/Reusable/CssTextField';
/**
 *@function Login.jsx
 *@author Azim
 *
 **/

const ForgotPassword = (props) => {
  const classes = useStyles();

  // const [values, setValues] = useState({
  //   email: '',
  // });
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  //login form handle section
  const handleLoginSubmit = (e) => {
    e.preventDefault();
  };

  const renderPasswordReset = () => {
    return (
      <Modal
        open={passwordResetSuccess}
        handleClose={() => setPasswordResetSuccess(false)}
        title='Password reset link sent to your email'
        image={images.userCreated}
      />
    );
  };
  return (
    <section className={classes.loginContainer}>
      {passwordResetSuccess && renderPasswordReset()}
      <Grid container>
        <SignBanner />
        <Grid className={classes.loginFormStyle} item md={6}>
          <Box>
            <Typography
              className={classes.welcomeMessage}
              variant='h3'
              component='p'
            >
              FORGOT PASSWORD
            </Typography>
            <form
              className={classes.root}
              onSubmit={handleLoginSubmit}
              noValidate
              autoComplete='off'
            >
              <CssTextField
                className={classes.margin}
                label='Email'
                variant='outlined'
                fullWidth
                id='custom-css-outlined-input'
              />
              <Grid container>
                <Grid item md={6} sm={6} lg={6}>
                  {' '}
                  <Button
                    type='submit'
                    size='large'
                    variant='contained'
                    color='primary'
                  >
                    SUBMIT
                  </Button>
                </Grid>
                <Grid
                  className={classes.forgotPassword}
                  item
                  md={6}
                  sm={6}
                  lg={6}
                >
                  <Link to='/'>
                    <Typography
                      variant='body2'
                      color='primary'
                      component='span'
                    >
                      LOGIN
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </form>
            <Typography style={{ color: 'black' }}>
              I am a new user{' '}
              <Link style={{ textDecoration: 'none' }} to='/signup'>
                <Typography variant='body2' color='primary' component='span'>
                  SIGNUP
                </Typography>{' '}
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </section>
  );
};

export default ForgotPassword;

//Material UI
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
      width: '90%',
    },
  },
  loginContainer: {
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  loginFormStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeMessage: {
    color: theme.palette.common.black,
    fontWeight: 500,
    margin: '3rem 0rem 2rem 0rem',
  },
  forgotPassword: {
    alignSelf: 'center',
    textAlign: 'end',
  },
}));
