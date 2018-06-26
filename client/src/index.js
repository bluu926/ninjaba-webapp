import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import 'semantic-ui-css/semantic.min.css';

import reducers from './reducers';
import App from './components/App';
import Home from './components/Home';
import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import Signout from './components/auth/Signout';
import Dashboard from './components/Dashboard';
import PlayerList from './components/players/PlayerList';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  {
    auth: {
      authenticated: localStorage.getItem('token'),
      userEmailAddress: localStorage.getItem('email')
    }
  },
  composeEnhancers(applyMiddleware(reduxThunk))
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route path="/" exact component={Home} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        <Route path="/signout" component={Signout} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/players" component={PlayerList} />
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
)
