import React, { useState, useEffect } from "react";
import {
  Button,
  makeStyles,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Box,
  Grid,
  TextField,
} from "@material-ui/core";
import { Link, useHistory, useLocation } from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {
  AddCircle,
  Notifications,
  AddCircleOutline,
  ExpandMore,
} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
import { images } from "../../assets";
import Avatars from "../../assets/Avatars";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewValueStream,
  getPersona,
  getProjectByUserId,
  signout,
  updatePersona,
} from "../../redux/actions";
import Modal from "../Reusable/Modal";
// import AvatarGroup from "@material-ui/lab/AvatarGroup";
import UserSignup from "../UserSignUp";
import { getOrganizationProfile } from "../../redux/actions";
import { WordCount, WordCountLength } from "../../Utils";
import CssTextField from "../Reusable/CssTextField";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

const drawerWidth = 245;

const Layout = ({ children, onDiagram }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  //redux data from Server
  const auth = useSelector((state) => state.auth);
  const { organizationProfile, profileItem } = useSelector(
    (state) => state.orgprofile
  );
  const { valueStream, persona } = useSelector((state) => state.diagram);
  const project = useSelector((state) => state.projects);
  // console.log({ orgProfile });
  const { roleType, organizationId, projectId, userId, name } = auth.user;

  const dispatch = useDispatch();
  const [openValueStremModal, setOpenValueStremModal] = useState(false);
  const [openAddUserModal, setOpenUserModal] = useState(false);
  const [showTextField, setShowTextField] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNewUser = () => {
    setOpenUserModal(true);
  };
  const renderUserSignUpModel = () => {
    return (
      <Modal
        open={openAddUserModal}
        handleClose={() => setOpenUserModal(false)}
        userSIgnUp
      >
        <UserSignup />
      </Modal>
    );
  };
  useEffect(() => {
    if (projectId) {
      dispatch(getOrganizationProfile(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    dispatch(getPersona(projectId));
  }, [dispatch, projectId]);
  //for development #TODO
  const menuItems = [
    // {
    //   text: "Home",
    //   icon: <Home color="secondary" />,
    //   path: "/",
    // },
    // {
    //   text: "Data",
    //   icon: <Home color="secondary" />,
    //   path: "/demo",
    // },
  ];

  const handleSignOut = () => {
    handleClose();
    dispatch(signout());
    history.push("/login");
  };

  const getAvatar = (value) => {
    let newData;
    Object.keys(Avatars).find((key, index) => {
      if (key === value) {
        newData = `${Avatars[value]}`;
        return newData;
      }
      return newData;
    });
    return newData;
  };
  const getAvatars = () => {
    let newData;
    Object.keys(Avatars).find((key, index) => {
      if (key === profileItem?.avatar) {
        newData = `${Avatars[profileItem.avatar]}`;
        return newData;
      }
      return newData;
    });
    return newData;
  };
  const {
    formState: { errors },
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    control: controlled,
  } = useForm({
    defaultValues: {
      name: persona?.name,
    },
  });
  console.log("Azim", persona?.name);
  const onUpdateSubmit = (data) => {
    const personaSubmit = { ...data, projectId, id: persona?.id };
    dispatch(updatePersona(personaSubmit, projectId, persona?.id));
    setShowTextField(false);
    resetUpdate();
  };

  const renderUpdatePersona = () => {
    return (
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleUpdateSubmit(onUpdateSubmit)}
      >
        <Box style={{ padding: "30px" }}>
          <Controller
            name="name"
            control={controlled}
            defaultValue={persona?.name}
            rules={{
              required: "This is field required",
              maxLength: 30,
              pattern: {
                value: /^\s*([a-zA-Z]+\s*){1}$/,
                message: "One Word Format Only",
              },
            }}
            render={({ field }) => (
              <CssTextField
                {...field}
                label="Persona*"
                variant="outlined"
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
          <br />
          <Button variant="contained" type="submit">
            Update
          </Button>
        </Box>
      </form>
    );
  };
  //get project Id Name
  useEffect(() => {
    if (auth?.user?.id) {
      dispatch(getProjectByUserId(auth?.user?.id));
    }
  }, [auth.user.id, dispatch]);

  const AvatarGroupSection = () => {
    return (
      <Box className={classes.AvatarSection}>
        {organizationProfile.map((item, index) => (
          <Link key={index} to={`/profile/${item.name}`}>
            <Avatar src={getAvatar(item?.avatar)} alt={item.name}>
              {item.name &&
                (WordCountLength(item.name) > 1
                  ? `${WordCount(item.name)[0].charAt(0)}${WordCount(
                      item.name
                    )[1].charAt(0)}`
                  : `${WordCount(item.name)[0].charAt(0)}`)}
            </Avatar>
          </Link>
        ))}
      </Box>
    );
  };
  const {
    formState: { errors: errorsState },
    register,
    handleSubmit,
    reset,
    control: realControl,
  } = useForm();
  const onSubmit = (data) => {
    console.log({ data });
    const newvalueStream = {
      valueStreamName: data.valueStreamName,
      valueStreamWhy: data.valueStreamWhy,
      persona: data.persona,
      organizationId,
      projectId,
      userId,
    };
    dispatch(addNewValueStream(newvalueStream, projectId));
    setOpenValueStremModal(false);
    reset();
  };

  const renderAddValueStreamModal = () => {
    return (
      <Modal
        open={openValueStremModal}
        handleClose={() => {
          setOpenValueStremModal(false);
          reset();
        }}
      >
        <form
          style={{ padding: "20px" }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            style={{ margin: "10px" }}
            variant="outlined"
            label="Value stream name*"
            placeholder="Value stream name*"
            {...register("valueStreamName", {
              required: "This is field required",
              min: 5,
              max: 3,
              pattern: {
                value: /^\s*([a-zA-Z]+\s*){3}$/,
                message: "Three Words Format Only",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="valueStreamName"
            render={({ message }) => (
              <p style={{ margin: "0", color: "red" }}>{message}</p>
            )}
          />
          <br />
          <TextField
            style={{ margin: "10px" }}
            variant="outlined"
            label="Value stream why*"
            placeholder="Value stream why*"
            {...register("valueStreamWhy", {
              required: "This is field required",
              maxLength: 30,
              pattern: {
                value: /^\s*([a-zA-Z]+\s*){3}$/,
                message: "Three Words Format Only",
              },
            })}
          />
          {console.log({ errors })}
          <ErrorMessage
            errors={errors}
            name="valueStreamWhy"
            render={({ message }) => (
              <p style={{ margin: "0", color: "red" }}>{message}</p>
            )}
          />
          <br />
          <Controller
            name="persona"
            control={realControl}
            defaultValue={persona?.name}
            rules={{
              required: "This is field required",
              maxLength: 30,
              pattern: {
                value: /^\s*([a-zA-Z]+\s*){1}$/,
                message: "One Word Format Only",
              },
            }}
            render={({ field }) => (
              <CssTextField
                {...field}
                label="Persona*"
                variant="outlined"
                type="text"
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <ErrorMessage
            errors={errorsState}
            name="persona"
            render={({ message }) => (
              <p style={{ margin: "0", color: "red" }}>{message}</p>
            )}
          />
          <br />
          <Button
            style={{ marginTop: "20px" }}
            variant="outlined"
            color="primary"
            type="submit"
          >
            Add Stream
          </Button>
        </form>
      </Modal>
    );
  };
  const handleOpenModalForValueStream = () => {
    //#TODO
    persona?.name && persona?.projectId && setOpenValueStremModal(true);
    // : setOpenPersonaModal(false);
  };
  return (
    <div className={classes.root}>
      {/* app bar */}
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar>
          {openValueStremModal && renderAddValueStreamModal()}
          <div className={classes.navBarScroll}>
            {valueStream && onDiagram && (
              <Grid className={classes.scrollUpStyle} container>
                {valueStream.length > 0
                  ? valueStream.map((item, index) => (
                      <Grid
                        style={{ marginRight: "20px" }}
                        key={index}
                        item
                        md={1}
                      >
                        <Box
                          className={classes.particularBox}
                          onClick={() =>
                            history.push(`/finalDiagram?streamId=${item.id}`)
                          }
                        >
                          <Box className={classes.boxCircle}>
                            <Typography className={classes.boxWording}>
                              {item.valueStreamName}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))
                  : null}

                <Box className={classes.AddboxCircle}>
                  <Button
                    onClick={handleOpenModalForValueStream}
                    className={classes.buttonStyle}
                    disableRipple
                    endIcon={
                      <AddCircleOutline className={classes.buttonInnerStyle} />
                    }
                  />
                </Box>
              </Grid>
            )}
          </div>

          <Typography className={classes.date}></Typography>
          <Notifications style={{ marginRight: "30px" }} />
          <Avatar className={classes.avatar} src={getAvatars()}>
            {name &&
              (WordCountLength(name) > 1
                ? `${WordCount(name)[0].charAt(0)}${WordCount(name)[1].charAt(
                    0
                  )}`
                : `${WordCount(name)[0].charAt(0)}`)}
          </Avatar>
          <Typography style={{ color: "black" }}>{auth.user?.name}</Typography>

          <div>
            <ExpandMore
              onClick={handleClick}
              title="logout"
              style={{
                margin: "0px 15px",
                cursor: "pointer",
                color: "black",
              }}
            />

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {/* <MenuItem onClick={handleProfile}>Profile</MenuItem> */}
              <MenuItem onClick={handleSignOut}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* side drawer */}
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
        anchor="left"
      >
        <div
          style={{
            marginTop: "1rem",
            marginLeft: "1rem",
            marginBottom: "1rem",
          }}
        >
          <Link to="/">
            <img
              src={images.homeLogo}
              style={{
                height: "102px",
                width: "195px",
                marginTop: "3px",
                marginLeft: "15px",
              }}
              alt=""
            />
          </Link>
        </div>

        {/* links/list section */}
        <List>
          {project?.project?.name && (
            <Typography
              title="project name"
              style={{ padding: "6px 30px", margin: "20px 10px 10px 0px" }}
              variant="p"
              component="h4"
              color="primary"
            >
              {project?.project?.name}
            </Typography>
          )}
          {roleType === "ADMIN" && (
            <Button
              color="primary"
              variant="contained"
              onClick={handleNewUser}
              style={{
                textAlign: "center",
                fontWeight: "600",
                lineHeight: "1.33",
                letterSpacing: "0.13px",
                color: "#fff",
              }}
              startIcon={<AddCircle />}
            >
              ADD NEW USER
            </Button>
          )}

          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => history.push(item.path)}
              className={
                location.pathname === item.path
                  ? classes.active
                  : classes.notActive
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        {AvatarGroupSection()}

        {/* #TODO #DONE Persona*/}
        {onDiagram && showTextField && renderUpdatePersona()}
        {onDiagram && (
          <div>
            {!showTextField && (
              <p
                title="click to update Persona"
                style={{ textAlign: "center" }}
                onClick={() => setShowTextField(true)}
              >
                {persona?.name}
              </p>
            )}
          </div>
        )}
      </Drawer>

      {/* main content */}
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {openAddUserModal && roleType === "ADMIN" && renderUserSignUpModel()}
        {children}
      </div>
    </div>
  );
};
export default Layout;

//layout section Material UI
const useStyles = makeStyles((theme) => {
  return {
    particularBox: {
      cursor: "pointer",
      display: "inline-block",
    },
    boxCircle: {
      borderRadius: "50%",
      background: "#005ae5",
      height: "58px",
      width: "58px",
      display: "flex",
      padding: ".5rem",
      justifyContent: "center",
      alignItems: "center",
    },
    boxWording: {
      color: "white",
      wordBreak: "break-all",
      whiteSpace: " normal",
      textAlign: "center",
      fontSize: "12px",
      fontWeight: "600",
    },
    AddboxCircle: {
      borderRadius: "50%",
      background: "#68e86d",
      height: "58px",
      width: "58px",
      display: "flex",
      padding: ".5rem",
      justifyContent: "center",
      alignItems: "center",
      "& .MuiButton-root:hover": {
        background: "none",
      },
      "& .MuiButton-endIcon": {
        margin: 0,
      },
    },
    buttonInnerStyle: {
      height: "60px",
      width: "80px",
    },
    buttonStyle: {
      color: "white",
      fontSize: "15px",
    },
    scrollUpStyle: {
      "&>div:not(:last-child)": {
        "&>div": {
          "&>div": {
            position: "relative",
            "&:after": {
              content: "''",
              position: "absolute",
              background: `url(${images.arrow})`,
              backgroundRepeat: "no-repeat",
              height: "15px",
              left: "103%",
              [theme.breakpoints.up("md")]: {
                width: "30%",
                left: "100%",
                backgroundSize: "auto",
              },
              [theme.breakpoints.down("md")]: {
                width: "90%",
                backgroundSize: "auto",
                left: "93%",
              },
              [theme.breakpoints.up("xl")]: {
                width: "300px",
                left: "50%",
                backgroundPosition: "center",
                // width: "",
              },
            },
          },
        },
      },
    },
    page: {
      width: "100%",
      padding: theme.spacing(1),
    },
    root: {
      display: "flex",
    },
    drawer: {
      width: drawerWidth,
      background: "#ffffff",
      "& .MuiListItem-button:hover": {
        background: "",
        color: "black",
      },
    },
    drawerPaper: {
      width: drawerWidth,
      background: "#ffffff",
      boxShadow: "0px 0px 6px gray",
      "& .MuiList-root": {
        textAlign: "center",
        justifyContent: "center",
        "& .MuiButton-containedPrimary": {
          padding: "8px 50px",
          marginBottom: "20px",
        },
      },
    },
    active: {
      background: "#eee",
      color: theme.palette.common.black,
      fontWeight: 600,
    },
    notActive: {
      color: theme.palette.common.black,
      background: "gray",
    },
    navBarScroll: {
      maxWidth: "700px",
      width: "100%",
      overflowY: "hidden",
    },
    title: {
      padding: theme.spacing(2),
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      // width: "100%",
      marginLeft: drawerWidth,
      background: "#ffffff",
      boxShadow: "0px 0px 6px gray",
    },
    AvatarSection: {
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
    },
    date: {
      flexGrow: 1,
    },
    toolbar: theme.mixins.toolbar,
    avatar: {
      marginRight: theme.spacing(2),
    },
    //dropdown select
    margin: {
      margin: `0px ${theme.spacing(2)}px`,
    },
  };
});
