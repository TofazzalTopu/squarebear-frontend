import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import CssTextField from '../CssTextField';
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

function ReUseDialog({ title, description, children, open, handleClose, form, fieldName, label, defaultValue }) {

    const {
        formState: { errors },
        handleSubmit,
        reset,
        control,
    } = useForm();
    const onSubmit = (data) => {
        console.log("Azim", { data });
        reset()
        handleClose()
    }
    return (
        <div>

            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {title}
                </DialogTitle>
                <DialogContent dividers>
                    {description && <Typography gutterBottom>
                        {description}
                    </Typography>}
                    {
                        form &&

                        <form
                            style={{ padding: "20px" }}
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Controller
                                name={fieldName}
                                control={control}
                                rules={{
                                    required: "This is field required",
                                    maxLength: 30,
                                }}
                                defaultValue={defaultValue}
                                render={({ field }) => (
                                    <CssTextField
                                        style={{ minWidth: "400px" }}
                                        {...field}
                                        label={`${label ? label : "Input"}*`}
                                        variant="outlined"
                                        type="text"
                                    />
                                )}
                            />
                            <ErrorMessage
                                errors={errors}
                                name={fieldName}
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
                                Save
                            </Button>
                        </form>
                    }
                    {children}
                </DialogContent>
                <DialogActions>
                    {/* <Button autoFocus onClick={handleClose} color="primary">
                        Save changes
                    </Button> */}
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default ReUseDialog;