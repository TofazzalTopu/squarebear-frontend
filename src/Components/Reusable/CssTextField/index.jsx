import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
const CssTextField = withStyles({
  root: {
    "& .MuiInputBase-root": {
      margin: "8px 0px",
      maxWidth: "428px",
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

export default CssTextField;
