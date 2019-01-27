import React, { Component } from 'react';
import './style/main.scss';

import ChatIndex from './components/ChatIndex';

import { Provider } from 'react-redux';
import store from './store/store';

class App extends Component {
  render() {
    return (
        <Provider store={store} >
          <ChatIndex />
        </Provider>
    );
  }
}

export default App;
