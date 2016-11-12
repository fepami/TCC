export default function(state = {tab: 'home'}, action){
	if(action.type === 'SWITCH_TAB'){
		return {tab: action.tab};
	}
	return state;
}