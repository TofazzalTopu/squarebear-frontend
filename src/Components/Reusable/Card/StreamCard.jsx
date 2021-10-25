/**
 *@function StreamCard.jsx
 *@author Azim
 *
 **/
import { Box } from "@material-ui/core";
import { Button, Typography } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import { Link } from "react-router-dom";

const StreamCard = (props) => {
  const {
    titleVariant,
    titleColor,
    titleText,
    description,
    isButton,
    buttonText,
    linkTo,
    linkData,
    children,
  } = props;

  return (
    <Box
      style={{
        padding: "20px 30px 83px 20px",
        margin: "12px 16px 34px 5px",
        height: "285px",
        borderRadius: "6px",
        backgroundColor: "#fff",
        boxShadow: "-1px 4px 8px 0 rgba(0, 0, 0, 0.36)",
        width: "100%",
      }}
    >
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant={titleVariant} color={titleColor}>
          {titleText}
        </Typography>
        <Link to={`/${linkTo}`}>
          <Typography>{linkData}</Typography>
        </Link>
      </Box>
      {description && (
        <Typography style={{ margin: "30px 0px 70px 0px" }} variant="body2">
          {description}
        </Typography>
      )}

      {isButton && (
        <Button
          color="primary"
          style={{ textAlign: "center" }}
          startIcon={<AddCircle />}
          variant="outlined"
        >
          {buttonText}
        </Button>
      )}
      {children}
    </Box>
  );
};
export default StreamCard;
