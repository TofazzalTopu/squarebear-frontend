import {
  Switch,
  Route,
} from "react-router-dom";
import ForgotPassword from '../Pages/ForgotPassword';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';
import PrivateRoute from './PrivateRoute';
import FinalDiagram from '../Pages/FinalDiagram';
import Demo from '../Pages/Demo';
import Profile from '../Pages/Profile';
import SplashScreen from '../Pages/SplashScreen';

const AppRouter = () => {

  return (
    <Switch>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      {/* <Route path="/azim">
        <NewSection />
      </Route> */}
      <PrivateRoute path="/" exact component={Home} />
      <PrivateRoute path="/project" exact component={SplashScreen} />
      <PrivateRoute path="/profile/:profileName?" exact component={Profile} />
      <PrivateRoute path="/demo" exact component={Demo} />
      <Route path="/finalDiagram/:streamId?">
        <FinalDiagram />
      </Route>
      <Route path="/forgot-password">
        <ForgotPassword />
      </Route>
      <Route exact path="*">
        <ForgotPassword />
      </Route>
    </Switch>

  )
}

export default AppRouter
