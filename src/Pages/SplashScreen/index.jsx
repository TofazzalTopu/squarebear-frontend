import { Button, Grid, Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useRef, useEffect } from "react";
import { images } from "../../assets";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addNewProject, getProjectByUserId } from "../../redux/actions";
// import Modal from "../../Components/Reusable/Modal";
import CssTextField from "../../Components/Reusable/CssTextField";
import AddIcon from "@material-ui/icons/Add";
import Modal from "../../Components/Reusable/Modal";

/**
 *@function SplashScreen.jsx
 *@author Azim
 *
 **/

const SplashScreen = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [openNewCreate, setOpenNewCreate] = useState(false);
  const [openModal, setOpenModal] = useState(true);
  const [errorMessage, setErrorMessage] = useState(false);
  const auth = useSelector((state) => state.auth);
  const project = useSelector((state) => state.projects);
  const modalRef = useRef();

  const {
    formState: { errors },
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    control,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const onCreateSubmit = (data) => {
    const newProjectData = { ...data, userId: auth.user.id };
    dispatch(addNewProject(newProjectData));
    resetUpdate();
    setOpenNewCreate(false);
  };
  useEffect(() => {
    if (auth?.user?.id) {
      dispatch(getProjectByUserId(auth.user.id));
    }
  }, [auth?.user?.id, dispatch]);

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
            control={control}
            rules={{
              required: true,
              maxLength: 30,
            }}
            defaultValue=""
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
  //Error states
  const renderErrorNewProject = () => {
    return (
      <Typography
        style={{
          color: "white",
          background: "red",
          padding: "5px",
          margin: "10px 20px",
          borderRadius: "3px",
        }}
      >
        maximum project for your subscription reached
      </Typography>
    );
  };

  const WelcomeModal = () => {
    return (
      <Modal
        image={images.successLogged}
        open={openModal}
        title="Welcome to your SquareBear experience"
        name={`Hello ${auth.user?.username ? auth.user?.name : "User"}`}
      >
        {openNewCreate && renderCreateNewProject()}

        {project?.project?.name && (
          <Button
            style={{ padding: "6px 30px", margin: "20px 10px 0px 0px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              history.push("/");
              setOpenModal(false);
            }}
          >
            {project?.project?.name}
          </Button>
        )}

        {auth?.user?.roleType === "ADMIN" && (
          <Button
            style={{ padding: "6px 30px", marginTop: "20px" }}
            variant="outlined"
            color="primary"
            onClick={
              project?.project?.name
                ? () => setErrorMessage(true)
                : () => setOpenNewCreate(true)
            }
            startIcon={<AddIcon fontSize="large" />}
          >
            NEW PROJECT
          </Button>
        )}

        {errorMessage && renderErrorNewProject()}
      </Modal>
    );
  };
  return <Box>{WelcomeModal()}</Box>;
};

export default SplashScreen;

const useStyles = makeStyles((theme) => ({
  welcomeMessage: {
    color: theme.palette.common.black,
    fontSize: "3rem",
    fontWeight: 600,
    margin: "20px 0px",
  },
}));
