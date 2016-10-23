import React, {Component} from 'react';
import {
	View,
	Text
} from 'react-native';
import Header from '../components/Header';

export default class HomeScene extends Component {
	render(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Home' />
				<Text>HOME</Text>
			</View>
		)
	}
}