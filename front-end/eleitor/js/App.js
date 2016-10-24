import React, {Component} from 'react';
import {View, StatusBar} from 'react-native';
import DefaultNavigator from './DefaultNavigator';

export default class App extends Component{
	render(){
		return(
			<View style={{flex: 1}} >
				<StatusBar
					translucent={true}
					backgroundColor='rgba(0,0,0,.2)' />
				<DefaultNavigator />
			</View>
		)
	}
}