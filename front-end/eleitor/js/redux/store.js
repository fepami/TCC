import { createStore, combineReducers } from 'redux';
import { default as navigation } from './reducers/navigation';
import { default as token } from './reducers/token';

export default createStore(combineReducers({
	navigation,
	token
}));