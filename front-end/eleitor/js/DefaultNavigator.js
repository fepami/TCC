import React, {Component} from 'react';
import {
	Navigator,
	Platform
} from 'react-native';
import NavigationManager from './navigation/NavigationManager';

export default class DefaultNavigator extends Component {
	render(){
		return(
			<Navigator
				ref='navigator'
				style={{flex: 1, backgroundColor: 'black'}}
				//mudar de NavigationManager para login
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