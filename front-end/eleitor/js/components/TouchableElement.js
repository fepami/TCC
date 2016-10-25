import React, {Component} from 'react';
import { TouchableHighlight, TouchableNativeFeedback, Platform } from 'react-native';

class TouchableElementAndroid extends Component {
	render() {
		return (
			<TouchableNativeFeedback 
				background={TouchableNativeFeedback.Ripple('rgba(0,0,0,.26)')} 
				{...this.props} />
		);
	}
}

class TouchableElementIOS extends Component {
	render() {
		return (
			<TouchableHighlight 
				underlayColor={'rgba(0,0,0,.3)'} 
				{...this.props}/>			
		);
	}
}

export default TouchableElement = Platform.OS === 'ios' ? TouchableElementIOS : TouchableElementIOS;