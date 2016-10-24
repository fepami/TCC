import { createStore, combineReducers } from 'redux';
import { default as navigation } from './reducers/navigation';

export default createStore(combineReducers({
	navigation
}));