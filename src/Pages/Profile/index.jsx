import { useEffect, useState } from "react";
import { Avatar, Box, Grid, IconButton, Paper } from "@material-ui/core";
import Layout from "../../Components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useToggle } from "../../hooks/useToggle";
import Modal from "../../Components/Reusable/Modal";
import Avatars from "../../assets/Avatars";
import { avatarChange } from "../../redux/actions";
import { WordCount, WordCountLength } from "../../Utils";
import EditIcon from "@material-ui/icons/Edit";
import ReUseDialog from "../../Components/Reusable/Dialog";
import { useParams } from "react-router";

/**
 *@function Profile.jsx
 *@author Azim
 *
 **/

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const { profileItem } = useSelector((state) => state.orgprofile);
  const dispatch = useDispatch();
  let { profileName } = useParams();
  console.log("from profile page", { profileName }, { profileItem });
  const classes = useStyles();
  const [isTextChanged, setIsTextChanged] = useToggle();
  const [openNameChange, setOpenNameChange] = useToggle();
  const [openEmailChange, setOpenEmailChange] = useToggle();
  const [openProjectNameChange, setOpenProjectNameChange] = useToggle();

  const handleChangeAvatar = (avatar) => {
    dispatch(avatarChange(user?.projectId, user?.id, avatar));
    setIsTextChanged(false);
  };

  const getAvatar = () => {
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
  const handleAvatarChange = () => {
    return (
      <Modal open={isTextChanged} handleClose={() => setIsTextChanged(false)}>
        <Box
          style={{
            marginTop: "40px",
          }}
        >
          <h1 className={classes.AvatarHeadLine}>Select your Avatar</h1>
          <Grid spacing={2} container>
            {Object.keys(Avatars).map((key, index) => (
              <Grid key={index} item sm={2}>
                <img
                  onClick={() => handleChangeAvatar(key)}
                  style={{ cursor: "pointer" }}
                  src={Avatars[key]}
                  alt="Avatar of this organization"
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
    );
  };
  const handleTextChange = () => {
    return (
      <ReUseDialog
        open={openNameChange}
        handleClose={() => setOpenNameChange(false)}
        title="Edit Name"
        form
        fieldName="name"
        defaultValue={user?.name}
        label="Name"
      ></ReUseDialog>
    );
  };
  const handleEmailChange = () => {
    return (
      <ReUseDialog
        open={openEmailChange}
        handleClose={() => setOpenEmailChange(false)}
        title="Edit email"
        form
        fieldName="email"
        defaultValue={user?.username}
        label="Email"
      ></ReUseDialog>
    );
  };
  const handleProjectNameChange = () => {
    return (
      <ReUseDialog
        open={openProjectNameChange}
        handleClose={() => setOpenProjectNameChange(false)}
        title="Edit project name"
        form
        fieldName="name"
        defaultValue={user?.username}
        label="Email"
      ></ReUseDialog>
    );
  };

  return (
    <Layout>
      <Grid
        container
        style={{ padding: "0px 10px 10px 10px", marginLeft: "7px" }}
      >
        <Grid item xs={12} md={8}>
          <h1>Your account</h1>
          <Paper elevation={3}>
            <div style={{ padding: "20px" }}>
              <div className={classes.account_and_name_wrapper}>
                <div style={{ marginLeft: "7px" }}>
                  {openNameChange && handleTextChange()}
                  {openEmailChange && handleEmailChange()}
                  {isTextChanged && handleAvatarChange()}
                  {openProjectNameChange && handleProjectNameChange()}
                  <Avatar
                    size={"large"}
                    title="change your avatar"
                    src={getAvatar()}
                    className={classes.purple}
                    onClick={() => setIsTextChanged(true)}
                  >
                    {user.name &&
                      (WordCountLength(user.name) > 1
                        ? `${WordCount(user.name)[0].charAt(0)}${WordCount(
                            user.name
                          )[1].charAt(0)}`
                        : `${WordCount(user.name)[0].charAt(0)}`)}
                  </Avatar>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "10px",
                  }}
                >
                  <Typography>
                    Name{" "}
                    <span style={{ marginLeft: "7px" }}>
                      <IconButton
                        onClick={() => setOpenNameChange(true)}
                        title="edit name"
                        aria-label="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                    </span>
                  </Typography>{" "}
                  <br />
                  <Typography variant="h4">{user.name}</Typography>
                </div>
              </div>
              {/* Role Email*/}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "7px",
                  }}
                >
                  <p>Role</p>
                  <br />
                  <Typography component="p" variant="h5">
                    {user.roleType}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "200px",
                  }}
                >
                  <p>
                    Email{" "}
                    {/* <span style={{ marginLeft: "7px" }}>
                      <IconButton
                        onClick={() => setOpenEmailChange(true)}
                        title="Edit your email"
                        aria-label="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                    </span> */}
                  </p>{" "}
                  <br />
                  <Typography component="p" variant="h5">
                    {user.username}
                  </Typography>
                </div>
              </div>
              {/* organization Name */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "7px",
                }}
              >
                <p>
                  Project name{" "}
                  <span style={{ marginLeft: "7px" }}>
                    <IconButton
                      onClick={() => setOpenProjectNameChange(true)}
                      title="Edit your Project name"
                      aria-label="Edit"
                    >
                      <EditIcon />
                    </IconButton>
                  </span>
                </p>{" "}
                <br />
                <Typography component="p" variant="h5">
                  {user.name}
                </Typography>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "20px",
  },
  account_and_name_wrapper: {
    display: "flex",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  AvatarHeadLine: {
    border: "1px solid gray",
    padding: "7px",
    borderRadius: "5px",
    marginTop: "10px",
  },
  purple: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    color: "black",
    background: "#005ae5",
    cursor: "pointer",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));
