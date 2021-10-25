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
import { useEffect, useState } from "react";
import { images } from "../../assets";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/actions";
import SignBanner from "../../Components/Reusable/SignBanner";
import { VoucherCode } from "../../assets/Data/VoucherCode";
import CssTextField from "../../Components/Reusable/CssTextField";

const Signup = () => {
  const classes = useStyles();
  const [userCreated, setUserCreated] = useState(false);
  const [submitting, setsubmitting] = useState(undefined);
  //RHF
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm();
  const voucher = watch("voucher");
  const dispatch = useDispatch();
  //async
  const onSubmit = (data) => {
    const { name, username, password } = data;
    let newData = { name, username, password };
    newData.roleType = "ADMIN";
    newData.isAdmin = true;
    dispatch(signup(newData));
    reset();
    setUserCreated(true);
  };

  //show password section
  const [values, setValues] = useState({
    showPassword: false,
  });
  // const user = useSelector((state) => state.user);

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const voucherData = (value) => {
    const Voucher = VoucherCode.find((data) => data.name === value);
    if (Voucher) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    if (voucher) {
      setsubmitting(VoucherCode.find((data) => data.name === voucher));
    }
  }, [voucher]);
  return (
    <section className={classes.loginContainer}>
      <Grid container>
        <SignBanner />
        <Grid className={classes.loginFormStyle} item md={6}>
          {userCreated ? (
            <Card>
              <Box style={{ padding: "6rem", textAlign: "center" }}>
                <Box>
                  <Typography style={{ fontWeight: "600", fontSize: "2rem" }}>
                    Voucher code <br /> shared successfully
                  </Typography>
                  <img src={images.userCreated} alt="" />
                </Box>
                <Link to="/">
                  <Button
                    style={{ marginTop: "3rem", padding: ".6rem 1.3rem" }}
                    color="primary"
                    variant="contained"
                  >
                    CONTINUE TO LOGIN
                  </Button>
                </Link>
              </Box>
            </Card>
          ) : (
            <Box style={{ maxWidth: "428px" }}>
              <Typography
                className={classes.welcomeMessage}
                variant="h4"
                component="h3"
              >
                Create your account
              </Typography>
              <Typography className={classes.spanTaginLogin} variant="body2">
                Enter credential to access Account{" "}
              </Typography>

              {/* hoook form section */}
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: true, maxLength: 20 }}
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
                {errors.name?.type === "required" && (
                  <Typography color="error">Name is required</Typography>
                )}
                <Controller
                  name="username"
                  control={control}
                  rules={{
                    required: true,
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
                {errors.username && (
                  <Typography style={{ margin: "0" }} color="error">
                    {errors.username.message}
                  </Typography>
                )}
                {errors.username?.type === "required" && (
                  <Typography color="error">{`Enter your valid mail`}</Typography>
                )}

                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
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
                {errors.password?.type === "required" && (
                  <Typography color="error">Password is required</Typography>
                )}
                <Controller
                  name="voucher"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    validate: voucherData,
                  }}
                  render={({ field }) => (
                    <CssTextField
                      {...field}
                      label="Voucher Code"
                      variant="outlined"
                      fullWidth
                      type="text"
                    />
                  )}
                />
                {errors.voucher?.type === "validate" && (
                  <Typography color="error">
                    Write proper voucher code
                  </Typography>
                )}
                {errors.voucher?.type === "required" && (
                  <Typography color="error">
                    Voucher Code is required
                  </Typography>
                )}
                <Box className={classes.boxStyle}>
                  <Typography style={{ fontWeight: "500" }}>
                    Already User?{" "}
                  </Typography>
                  <Link
                    style={{ textDecoration: "none", marginLeft: "2rem" }}
                    to="/"
                  >
                    {" "}
                    <Typography
                      variant="body1"
                      color="primary"
                      component="span"
                    >
                      REQUEST A CODE
                    </Typography>
                  </Link>
                </Box>

                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {submitting ? (
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      color="primary"
                      style={{ display: "inline-block" }}
                    >
                      REGISTER
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      color="primary"
                      disabled
                      style={{ display: "inline-block" }}
                    >
                      REGISTER
                    </Button>
                  )}
                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "500",
                    }}
                    component="span"
                  >
                    Already user?
                    <Link style={{ textDecoration: "none" }} to="/">
                      <Typography
                        variant="body2"
                        color="primary"
                        component="span"
                      >
                        {" "}
                        &nbsp; LOGIN
                      </Typography>{" "}
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Box>
          )}
        </Grid>
      </Grid>
    </section>
  );
};

export default Signup;

//material Ui styles

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
  },
  spanTaginLogin: {
    margin: "10px 0px",
    color: "black",
    fontWeight: 500,
    fontSize: "1.1rem",
  },
  welcomeMessage: {
    color: "black",
    fontSize: "3rem",
    fontWeight: 600,
  },
  boxStyle: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "20px 10px 40px 10px",
  },
}));
