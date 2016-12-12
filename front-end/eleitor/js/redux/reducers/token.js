export default function(state = {}, action){
	if(action.type === 'SET_TOKEN'){
		return {token: action.token};
	}
	return state;
}