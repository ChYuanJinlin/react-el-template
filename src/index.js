import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import 'element-theme-default';
import thunk from 'redux-thunk'
import reducers from './store'
import './index.css';
import App from './App';
let store = createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))
ReactDOM.render((
    <App store={store} />
), document.getElementById('root'))


