import React, {Component} from 'react';
import {
	Navigator,
	Platform
} from 'react-native';
import NavigationManager from './navigation/NavigationManager';
import LoginScene from './scenes/LoginScene';

export default class DefaultNavigator extends Component {
	render(){
		return(
			<Navigator
				ref='navigator'
				style={{flex: 1}}
				//mudar de NavigationManager para login
				// initialRoute={{component: LoginScene}}
				initialRoute={{component: NavigationManager}}
				renderScene={this.renderScene}
				configureScene={route => {
					if(Platform.OS === 'android'){
						return Navigator.SceneConfigs.FloatFromBottomAndroid;
					}
					if(route.modal){
						return Navigator.SceneConfigs.FloatFromBottom;
					} else {
						return Navigator.SceneConfigs.FloatFromRight;
					}
				}}
			/>
		)
	}
	renderScene(route, navigator) {
		return <route.component {...route.passProps} navigator={navigator} />
	}
}