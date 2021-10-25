import { useEffect } from "react";
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../themes';
import AppRouter from './AppRouter';
import { useDispatch, useSelector } from "react-redux";
import { isUserLoggedIn } from '../redux/actions';

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  //componentDidmount with useEffect
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
  }, [dispatch, auth.authenticate]);

  return (
    < ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
