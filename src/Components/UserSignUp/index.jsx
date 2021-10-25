import {
  Button,
  Grid,
  Card,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useState } from "react";
import { images } from "../../assets";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/actions";
import { useToggle } from "../../hooks/useToggle";
import { ErrorMessage } from "@hookform/error-message";

const UserSignup = (props) => {
  const classes = useStyles();
  //MODAL___SUCCESS__IF__USER__CREATED
  const [userCreated, setUserCreated] = useToggle();
  //REDUX__START
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { organizationId, projectId } = auth.user;
  //REACT__HOOK__FORM
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  //SUBMITTING__DATA
  const onSubmit = async (data) => {
    const { name, username, password } = data;
    let newData = { name, username, password };
    newData.roleType = "USER";
    newData.organizationId = organizationId;
    newData.projectId = projectId;
    newData.isAdmin = false;
    console.log(newData);
    dispatch(signup(newData));
    reset();
    setUserCreated(true);
  };

  //show password section
  const [values, setValues] = useState({
    showPassword: false,
  });
  // const user = useSelector((state) => state.user);
  // console.log(user.message);
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  return (
    <section className={classes.loginContainer}>
      <Grid container>
        {/* <SignBanner /> */}
        <Grid className={classes.loginFormStyle} item>
          {userCreated ? (
            <Card>
              <Box style={{ padding: "4rem", textAlign: "center" }}>
                <Box>
                  <Typography style={{ fontWeight: "600", fontSize: "2rem" }}>
                    User Created
                    <br /> successfully
                  </Typography>
                  <img src={images.userCreated} alt="" />
                </Box>
                <Link to="/">
                  <Button
                    style={{ marginTop: "3rem", padding: ".6rem 1.3rem" }}
                    color="primary"
                    variant="contained"
                  >
                    Done
                  </Button>
                </Link>
              </Box>
            </Card>
          ) : (
            <Box style={{ margin: "30px 20px" }}>
              <Typography
                className={classes.welcomeMessage}
                variant="h6"
                component="h5"
              >
                Add to team
              </Typography>
              {/* hoook form section */}
              <form
                className={classes.root}
                style={{ minWidth: "450px" }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "This is field required", maxLength: 20 }}
                  render={({ field }) => (
                    <CssTextField
                      {...field}
                      label="Name"
                      variant="outlined"
                      fullWidth
                      type="text"
                    />
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name="name"
                  render={({ message }) => (
                    <p style={{ margin: "0", color: "red" }}>{message}</p>
                  )}
                />
                <Controller
                  name="username"
                  control={control}
                  rules={{
                    required: "This is field required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Entered value does not match email format",
                    },
                  }}
                  defaultValue=""
                  render={({ field }) => (
                    <CssTextField
                      {...field}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      type="email"
                    />
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name="username"
                  render={({ message }) => (
                    <p style={{ margin: "0", color: "red" }}>{message}</p>
                  )}
                />
                {/* {errors.username?.type === "required" && (
                  <Typography color="error">{`Enter your valid mail`}</Typography>
                )} */}

                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "This is field required",
                  }}
                  render={({ field }) => (
                    <CssTextField
                      variant="outlined"
                      {...field}
                      fullWidth
                      label="Password"
                      type={values.showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword}>
                              {values.showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => (
                    <p style={{ margin: "0", color: "red" }}>{message}</p>
                  )}
                />

                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    color="primary"
                    style={{ display: "inline-block", marginTop: "20px" }}
                  >
                    CREATE
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Grid>
      </Grid>
    </section>
  );
};

export default UserSignup;

//material Ui styles

const CssTextField = withStyles({
  root: {
    "& .MuiInputBase-root": {
      margin: "8px 0px",
    },
    "& .MuiOutlinedInput-input": {
      color: "gray",
    },
    "& .MuiSvgIcon-root": {
      color: "gray",
    },
    "& label.Mui-focused": {
      color: "gray",
    },
    "& .MuiFormLabel-root": {
      color: "gray",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "gray",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "gray",
      },
      "&:hover fieldset": {
        borderColor: "gray",
      },
      "&.Mui-focused fieldset": {
        borderColor: "gray",
      },
    },
  },
})(TextField);

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      width: "90%",
      ".MuiTextField-root": {
        color: "gray",
      },
      "& .MuiOutlinedInput-input": {
        color: "gray",
      },
    },
  },
  loginContainer: {
    maxWidth: "100%",
    overflow: "hidden",
    position: "relative",
  },
  loginFormStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "500px",
  },
  spanTaginLogin: {
    margin: "10px 0px",
    color: "black",
    fontWeight: 500,
    fontSize: "1.1rem",
  },
  squareText: {
    letterSpacing: 3,
    fontWeight: 800,
    textShadow: "1px 1px black",
  },
  BearText: {
    letterSpacing: 3,
    fontWeight: 800,
    color: theme.palette.common.white,
    textShadow: "1px 1px black",
  },
  welcomeMessage: {
    color: "black",
    fontSize: "2rem",
    fontWeight: 600,
    marginBottom: "20px",
  },
  ForgotAndLogin: {
    display: "flex",
    justifyContent: "space-between",
  },
  forgotPassword: {
    alignSelf: "center",
    textAlign: "end",
    position: "relative",
  },
  boxStyle: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "20px 10px 40px 10px",
  },
}));
