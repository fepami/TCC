export default function(state = {tab: 'politicos'}, action){
	if(action.type === 'SWITCH_TAB'){
		return {tab: action.tab};
	}
	return state;
}