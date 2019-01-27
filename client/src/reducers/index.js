import { combineReducers } from 'redux';

import textReducer from './test';


export default combineReducers({
    test: textReducer
})
