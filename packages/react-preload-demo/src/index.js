import 'babel-polyfill';

import './reset.scss';
import './styles.scss';

import ReactDOM from 'react-dom';
import React, { Component } from 'react';

const App = () => <div>Hello World!</div>;

ReactDOM.render(<App />, document.getElementById('app'));
