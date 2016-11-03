export default function(state = {tab: 'perfil'}, action){
	if(action.type === 'SWITCH_TAB'){
		return {tab: action.tab};
	}
	return state;
}