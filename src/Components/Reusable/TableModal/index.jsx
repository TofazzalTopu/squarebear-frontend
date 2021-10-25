import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal as ReUseModal, Typography, Box } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";

const TableModal = (props) => {
  const classes = useStyles();
  return (
    <div>
      <ReUseModal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <Box align="center" className={classes.paper}>
            {/* Cross Button */}
            {/* {props.handleClose && (
              <Typography>
                {" "}
                <CloseIcon
                  className={classes.buttonOfClose}
                  onClick={props.handleClose}
                />
              </Typography>
            )} */}
            {props.children}
          </Box>
        </Fade>
      </ReUseModal>
    </div>
  );
};
export default TableModal;

//material Ui
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiBackdrop-root": {
      backgroundColor: "rgba(0,0,0,.5)",
    },
  },
  paper: {
    minHeight: 500,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "6px",
    position: "relative",
    padding: theme.spacing(2, 4, 3),
    "&:focus-visible": {
      outline: "none",
    },
  },
  buttonOfClose: {
    position: "absolute",
    zIndex: "111",
    left: "87%",
    top: "7%",
    cursor: "pointer",
    color: "white",
  },
}));

// const renderFormUpdateOnDoubleClick = (updatedData) => {
//   return (
//     <form
//       id="hook-form"
//       noValidate
//       autoComplete="off"
//       onSubmit={handleSubmit(onUpdateSubmit)}
//     >
//       <Grid container>
//         <Grid item md={4}>
//           <Controller
//             name="processName"
//             control={control}
//             defaultValue={updatedData.data?.processName}
//             rules={{
//               required: true,
//               maxLength: 30,
//               pattern: {
//                 value: /^\s*([a-zA-Z]+\s*){3}$/,
//                 message: "Three Words Format Only",
//               },
//             }}
//             render={({ field }) => (
//               <CssTextField
//                 {...field}
//                 label="Process Name"
//                 variant="outlined"
//                 type="text"
//               />
//             )}
//           />

//           {errors.processName && (
//             <Typography style={{ margin: "0" }} color="error">
//               {errors.processName.message}
//             </Typography>
//           )}
//         </Grid>

//         <Grid item md={4}>
//           <Controller
//             name="processWhy"
//             control={control}
//             defaultValue={updatedData.data?.processWhy}
//             rules={{
//               required: true,
//               maxLength: 30,
//               pattern: {
//                 value: /^\s*([a-zA-Z]+\s*){3}$/,
//                 message: "Three Words Format Only",
//               },
//             }}
//             render={({ field }) => (
//               <CssTextField
//                 {...field}
//                 label="Process Name Why"
//                 variant="outlined"
//                 type="text"
//               />
//             )}
//           />
//           {errors.processWhy && (
//             <Typography style={{ margin: "0", color: "red" }}>
//               {errors.processWhy.message}
//             </Typography>
//           )}
//         </Grid>
//         <Grid item md={4}>
//           <TextField
//             id="outlined-read-only-input"
//             label="Persona"
//             defaultValue={updatedData.data?.persona}
//             InputProps={{
//               readOnly: true,
//             }}
//             variant="outlined"
//           />
//         </Grid>
//       </Grid>

//       <Box className={classes.AddInstructionBtn}>
//         <Button
//           style={{ margin: "20px 20px 10px 0px" }}
//           variant="outlined"
//           color="primary"
//           type="submit"
//         >
//           Update Node Data
//         </Button>
//       </Box>
//     </form>
//   );
// };
