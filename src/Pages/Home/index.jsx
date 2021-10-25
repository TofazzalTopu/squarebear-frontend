import {
  Button,
  makeStyles,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import Layout from "../../Components/Layout";
import FirstCard from "../../Components/Reusable/Card/FirstCard";
import Modal from "../../Components/Reusable/Modal";
import { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  addNewPersona,
  addNewValueStream,
  deleteValueStream,
  getPersona,
  updateValueStream,
} from "../../redux/actions";
// import { nanoid } from 'nanoid';
import { getNewValueStream } from "../../redux/actions";
import StreamCard from "../../Components/Reusable/Card/StreamCard";
import SecondCard from "../../Components/Reusable/Card/SecondCard";
import { useToggle } from "../../hooks/useToggle";
import { images } from "../../assets";
import DeleteIcon from "@material-ui/icons/Delete";
import CssTextField from "../../Components/Reusable/CssTextField";
// import { MiniMap } from "react-flow-renderer";
import { ErrorMessage } from "@hookform/error-message";

const Home = () => {
  //open Modal states
  const [modalData, setModalData] = useState({});
  const [openValueStremModal, setOpenValueStremModal] = useState(false);
  const [openPersonaModal, setOpenPersonaModal] = useToggle();
  const [updateModal, setUpdateModal] = useToggle();
  //redux
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { organizationId, id: userId, projectId } = auth?.user;
  const { valueStream, persona } = useSelector((state) => state.diagram);

  //rhf
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    control: realControl,
  } = useForm();
  const history = useHistory();
  const onSubmit = (data) => {
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

  const {
    formState: formData,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    watch,
    control,
  } = useForm({
    defaultValues: {
      valueStreamName: modalData?.valueStreamName,
      valueStreamWhy: modalData?.valueStreamWhy,
      persona: modalData?.persona,
    },
  });

  const newvalueStreamName = watch("valueStreamName");
  const newValueStreamWhy = watch("valueStreamWhy");
  const newPersona = watch("persona");
  const onUpdateSubmit = () => {
    resetUpdate();
    setModalData({});
  };
  const handleDeleteEpic = () => {
    dispatch(deleteValueStream(modalData?.id));
    setUpdateModal(false);
    resetUpdate();
    setModalData({});
  };

  useEffect(() => {
    dispatch(getNewValueStream(projectId));
  }, [dispatch, projectId]);
  //getting Persona Data
  useEffect(() => {
    dispatch(getPersona(projectId));
  }, [dispatch, projectId]);

  const {
    formState: { errors: errorState },
    handleSubmit: handlePersonaSubmit,
    reset: resetPersona,
    control: controlled,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const onCreateSubmit = (data) => {
    const personaSubmit = { ...data, projectId };
    console.log("Azim", { personaSubmit });
    dispatch(addNewPersona(personaSubmit, projectId));
    setOpenPersonaModal(false);
    resetPersona();
  };

  const renderAddNewPersona = () => {
    return (
      <Modal
        open={openPersonaModal}
        handleClose={() => {
          setOpenPersonaModal(false);
          resetPersona();
        }}
      >
        <form
          noValidate
          autoComplete="off"
          onSubmit={handlePersonaSubmit(onCreateSubmit)}
        >
          <Box style={{ padding: "30px" }}>
            <Controller
              name="name"
              control={controlled}
              defaultValue=""
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
              errors={errorState}
              name="name"
              render={({ message }) => (
                <p style={{ margin: "0", color: "red" }}>{message}</p>
              )}
            />
            <br />
            <Button variant="contained" type="submit">
              Add
            </Button>
          </Box>
        </form>
      </Modal>
    );
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
            errors={errors}
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
  const handleUpdateModal = () => {
    const updates = { newvalueStreamName, newValueStreamWhy, newPersona };
    if (
      updates.newPersona ||
      updates.newValueStreamWhy ||
      updates.newvalueStreamName
    ) {
      const updatedValueStream = {
        id: modalData?.id,
        valueStreamName: updates?.newvalueStreamName,
        valueStreamWhy: updates?.newValueStreamWhy,
        persona: updates?.newPersona,
        organizationId,
        projectId,
        userId,
      };
      dispatch(updateValueStream(modalData?.id, updatedValueStream));
      setUpdateModal(false);
      resetUpdate();
    } else {
      setUpdateModal(false);
      resetUpdate();
    }
  };

  const renderUpdateValueStreamModal = () => {
    return (
      <Modal open={updateModal} handleClose={handleUpdateModal}>
        <form
          noValidate
          style={{ padding: "40px" }}
          autoComplete="off"
          onSubmit={handleUpdateSubmit(onUpdateSubmit)}
        >
          <Controller
            name="valueStreamName"
            control={control}
            defaultValue={modalData?.valueStreamName}
            rules={{
              required: "This is field required",
              maxLength: 30,
              pattern: {
                value: /^\s*([a-zA-Z]+\s*){1}$/,
                message: "Three Words Format Only",
              },
            }}
            render={({ field }) => (
              <CssTextField
                {...field}
                label="Value stream name*"
                variant="outlined"
                type="text"
              />
            )}
          />
          <ErrorMessage
            errors={{ formData }}
            name="valueStreamName"
            render={({ message }) => (
              <p style={{ margin: "0", color: "red" }}>{message}</p>
            )}
          />
          <br />
          <Controller
            name="valueStreamWhy"
            control={control}
            defaultValue={modalData?.valueStreamWhy}
            rules={{
              required: true,
              maxLength: 30,
              pattern: {
                value: /^\s*([a-zA-Z]+\s*){3}$/,
                message: "Three Words Format Only",
              },
            }}
            render={({ field }) => (
              <CssTextField
                {...field}
                label="Value stream why*"
                variant="outlined"
                type="text"
              />
            )}
          />
          <br />
          <Controller
            name="persona"
            control={control}
            defaultValue={persona?.name}
            rules={{
              required: true,
              maxLength: 30,
              pattern: {
                value: /^\s*([a-zA-Z]+\s*){1}$/,
                message: "one Word Format Only",
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
        </form>
        <IconButton
          onClick={() => handleDeleteEpic(modalData?.id)}
          style={{ marginTop: "-20px" }}
          title="Delete value Stream"
          color="secondary"
          aria-label="add an alarm"
        >
          <DeleteIcon fontSize="large" />
        </IconButton>
      </Modal>
    );
  };

  const handleOpenModalForValueStream = () => {
    //#TODO
    persona?.name && persona?.projectId
      ? setOpenValueStremModal(true)
      : setOpenPersonaModal(false);
  };
  const handleOpenModalForUpdateValueStream = (item) => {
    setModalData(item);
    setUpdateModal(true);
  };
  const classes = useStyles();
  return (
    <Layout>
      <section>
        {openValueStremModal && renderAddValueStreamModal()}
        {updateModal && renderUpdateValueStreamModal()}
        {openPersonaModal && renderAddNewPersona()}

        <Grid spacing={2} container justify="center">
          <Grid item sm={9}>
            <Grid
              spacing={2}
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              <Grid className={classes.cardSection} item sm={6}>
                <FirstCard
                  titleVariant="h5"
                  titleText="Coming Soon..."
                  description="We are working on bringing this exiciting new square for you."
                  linkTo="templates"
                  // linkData="Edit"
                />
              </Grid>
              <Grid item sm={6}>
                <FirstCard
                  titleVariant="h5"
                  titleText="Coming Soon..."
                  description="We are working on bringing this exiciting new square for you."
                />
              </Grid>
            </Grid>
            {/* container */}
            <Grid>
              <StreamCard titleVariant="h5" titleText="Value Stream">
                <Box className={classes.streamCardBox}>
                  <Grid className={classes.scrollUpStyle} container>
                    {valueStream.length > 0
                      ? valueStream.map((item, index) => (
                          <Grid
                            style={{
                              marginRight: "58px",
                              position: "relative",
                              minWidth: "149px",
                            }}
                            key={index}
                            item
                            md={2}
                          >
                            <img
                              onClick={() =>
                                handleOpenModalForUpdateValueStream(item)
                              }
                              src={images.edit}
                              className={classes.iconStyle}
                              alt="Edit Button"
                            />
                            <Box
                              className={classes.particularBox}
                              onClick={() =>
                                history.push(
                                  `/finalDiagram?streamId=${item.id}`
                                )
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
                          <AddCircleOutlineIcon
                            className={classes.buttonInnerStyle}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                </Box>
              </StreamCard>
            </Grid>
            <Grid
              spacing={2}
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              <Grid className={classes.cardSection} item sm={6}>
                <FirstCard
                  titleVariant="h5"
                  titleText="Coming Soon..."
                  description="We are working on bringing this exiciting new square for you."
                  linkTo="templates"
                  // linkData="Edit"
                />
              </Grid>
              <Grid item sm={6}>
                <FirstCard
                  titleVariant="h5"
                  titleText="Coming Soon..."
                  description="We are working on bringing this exiciting new square for you."
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={3}>
            <SecondCard
              titleVariant="h5"
              titleText="Coming Soon..."
              description="We are working on bringing this exiciting new square for you."
              linkTo="templates"
            >
              {/* <MiniMap /> */}
            </SecondCard>
          </Grid>
        </Grid>
      </section>
    </Layout>
  );
};

export default Home;

const useStyles = makeStyles((theme) => {
  return {
    cardSection: {
      "&>div": {
        marginLeft: "5px",
      },
    },
    iconStyle: {
      width: "17px",
      position: "absolute",
      top: "25px",
      zIndex: "1",
      right: "50px",
      cursor: "pointer",
      color: "red",
    },
    particularBox: {
      cursor: "pointer",
      display: "inline-block",
    },
    boxCircle: {
      borderRadius: "50%",
      background: "#005ae5",
      height: "128px",
      width: "128px",
      display: "flex",
      // position: "relative",
      padding: "1.5rem",
      justifyContent: "center",
      alignItems: "center",
    },
    AddboxCircle: {
      borderRadius: "50%",
      background: "#68e86d",
      height: "128px",
      width: "128px",
      display: "flex",
      padding: "1.5rem",
      justifyContent: "center",
      alignItems: "center",
      "& .MuiButton-root:hover": {
        background: "none",
      },
      "& .MuiButton-endIcon": {
        margin: 0,
      },
    },
    boxWording: {
      color: "white",
      wordBreak: "break-all",
      whiteSpace: " normal",
      textAlign: "center",
      fontSize: "12px",
      fontWeight: "600",
    },
    buttonStyle: {
      color: "white",
      fontSize: "15px",
    },
    buttonInnerStyle: {
      height: "60px",
      width: "80px",
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
              height: "50px",
              left: "103%",
              [theme.breakpoints.up("md")]: {
                width: "300px",
                height: "35px",
                backgroundSize: "auto",
                left: "97%",
              },
              [theme.breakpoints.up("mdx")]: {
                width: "300px",
                height: "40px",
                backgroundSize: "auto",
                left: "100%",
              },
              [theme.breakpoints.up("lg")]: {
                //min
                width: "300px",
                height: "60px",
                left: "5%",
                backgroundPosition: "center",
              },
              [theme.breakpoints.up("llg")]: {
                //min
                width: "300px",
                height: "79px",
                left: "13%",
                backgroundPosition: "center",
              },
              [theme.breakpoints.up("xlx")]: {
                //min
                width: "300px",
                height: "90px",
                left: "18%",
                backgroundPosition: "center",
              },
            },
          },
        },
      },
    },
    streamCardBox: {
      display: "flex",
      overflowY: "hidden",
      marginTop: "10px",
      alignItems: "center",
      maxWidth: "970px",
      [theme.breakpoints.up("xlx")]: {
        maxWidth: "1280px",
      },
      [theme.breakpoints.up("xl")]: {
        maxWidth: "1360px",
      },
      padding: "20px 0px",
      "& .MuiGrid-container": {
        flexWrap: "nowrap",
      },
      "&": {
        "&::-webkit-scrollbar": {
          width: "0.5em",
          height: ".8em",
        },

        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.primary,
          borderRadius: "3px",

          "&:hover": {
            background: "gray",
          },
        },
      },
    },
  };
});
