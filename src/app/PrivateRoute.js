import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      component={(props) => {
        const token = window.localStorage.getItem("sqtoken");
        const user = window.localStorage.getItem("squser");
        if (token && user) {
          return <Component {...props} />;
        } else {
          return <Redirect exact to={`/login`} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
