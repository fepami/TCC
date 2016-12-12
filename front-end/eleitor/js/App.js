import React, {Component} from 'react';
import {View, StatusBar} from 'react-native';
import DefaultNavigator from './DefaultNavigator';
import Splash from './Splash';

export default class App extends Component{
	render(){
		return(
			<View style={{flex: 1}} >
				<StatusBar
					translucent={true}
					barStyle="light-content"
					backgroundColor='rgba(0,0,0,.2)' />
				<Splash />
			</View>
		)
	}
}