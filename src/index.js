import React from 'react';
import ReactDOM from 'react-dom';
import 'core-js';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import {
  ReactFlowProvider,
} from 'react-flow-renderer';
import App from './app/App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from './redux/store';
ReactDOM.render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <Router>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </Router>

    {/* </React.StrictMode> */}
  </Provider>,
  document.getElementById('root')
);
reportWebVitals();
