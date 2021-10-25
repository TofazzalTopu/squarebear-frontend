import {
  Button,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ControlPointOutlined,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import { useState, useRef } from "react";
import { images } from "../../assets";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addNewProject, login } from "../../redux/actions";
import Modal from "../../Components/Reusable/Modal";
import SignBanner from "../../Components/Reusable/SignBanner";
import CssTextField from "../../Components/Reusable/CssTextField";
import AddIcon from "@material-ui/icons/Add";

/**
 *@function Login.jsx
 *@author Azim
 *
 **/
const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [openNewCreate, setOpenNewCreate] = useState(false);
  const auth = useSelector((state) => state.auth);

  //RHF
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const {
    formState: { newErrors },
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    control: controlled,
  } = useForm();
  const onSubmit = (data) => {
    dispatch(login(data));
    reset();
  };
  const modalRef = useRef();
  const projects = useSelector((state) => state.projects);
  console.log({ projects });
  //states of login Component
  const [values, setValues] = useState({
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  //modal states
  const renderCreateNewProject = () => {
    return (
      <Modal
        ref={modalRef}
        open={openNewCreate}
        handleClose={() => setOpenNewCreate(false)}
      >
        {renderFormUpdateOnDoubleClick()}
      </Modal>
    );
  };

  const onCreateSubmit = (data) => {
    dispatch(addNewProject(data));
    resetUpdate();
    setOpenNewCreate(false);
  };

  const renderFormUpdateOnDoubleClick = () => {
    return (
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleUpdateSubmit(onCreateSubmit)}
      >
        <Box style={{ padding: "30px" }}>
          <Controller
            name="name"
            control={controlled}
            rules={{
              required: true,
              maxLength: 30,
            }}
            render={({ field }) => (
              <CssTextField
                {...field}
                label="Project name*"
                variant="outlined"
                type="text"
              />
            )}
          />

          {errors.name && (
            <Typography style={{ margin: "0" }} color="error">
              Please write your Project Name
            </Typography>
          )}
          <br />
          <Button variant="contained" type="submit">
            Create
          </Button>
        </Box>
      </form>
    );
  };

  if (openModal) {
    return (
      <Modal
        image={images.successLogged}
        open={openModal}
        title="Welcome to your SquareBear experience"
        name={`Hello ${auth.user?.username ? auth.user?.name : "User"}`}
        handleClose={() => setOpenModal(false)}
        link="/"
      >
        {openNewCreate && renderCreateNewProject()}
        <Button
          style={{ padding: "6px 30px", marginTop: "20px" }}
          variant="outlined"
          color="primary"
          onClick={() => setOpenNewCreate(true)}
          startIcon={<AddIcon fontSize="large" />}
        >
          NEW PROJECT
        </Button>
      </Modal>
    );
  }

  if (auth.authenticate) {
    return <Redirect to="/project" />;
  }
  return (
    <section className={classes.loginContainer}>
      <Grid container>
        <SignBanner />
        <Grid className={classes.loginFormStyle} item md={6}>
          <Box style={{ maxWidth: "428px" }}>
            <Typography
              className={classes.welcomeMessage}
              variant="body1"
              component="h3"
            >
              Welcome back
            </Typography>
            <Typography style={{ color: "red", padding: "10px 0px" }}>
              {auth?.state?.error}
            </Typography>
            <form
              className={classes.root}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                defaultValue="awsaf@gmail.com"
                render={({ field }) => (
                  <CssTextField
                    {...field}
                    style={{ minWidth: "428px" }}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    type="email"
                  />
                )}
              />
              {errors.username && (
                <Typography style={{ color: "red" }}>
                  {errors.username.message}
                </Typography>
              )}
              {errors.username?.type === "required" && (
                <Typography
                  style={{ color: "red" }}
                >{`Enter your valid mail`}</Typography>
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
                    style={{ minWidth: "428px" }}
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
                <Typography style={{ color: "red" }}>
                  Password is required
                </Typography>
              )}
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "20px 0px",
                }}
              >
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  style={{ display: "inline-block" }}
                >
                  LOGIN
                </Button>
                <Typography variant="body2" color="primary" component="span">
                  {/* <Link
                    style={{ textDecoration: "none" }}
                    to="/forgot-password"
                  >
                    <Typography
                      variant="body2"
                      color="primary"
                      component="span"
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        textAlign: "left",
                        marginRight: "40px",
                      }}
                    >
                      {" "}
                      &nbsp; FORGOT PASSWORD
                    </Typography>{" "}
                  </Link> */}
                </Typography>
              </Box>
            </form>

            <Typography style={{ color: "#000", fontWeight: "500" }}>
              <Link style={{ textDecoration: "none" }} to="/signup">
                <Typography
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                  variant="body2"
                  color="primary"
                  component="span"
                >
                  SIGNUP
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </section>
  );
};

export default Login;

//Material Ui css

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      maxWidth: "100%",
      ".MuiTextField-root": {
        color: "white",
      },
      "& .MuiSvgIcon-root": {
        color: "white",
      },
      "& .MuiOutlinedInput-input": {
        color: "black",
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

  welcomeMessage: {
    color: theme.palette.common.black,
    fontSize: "3rem",
    fontWeight: 600,
    margin: "20px 0px",
  },
}));
