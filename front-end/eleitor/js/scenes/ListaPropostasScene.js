import React, {Component} from 'react';
import {
	View,
	Text
} from 'react-native';
import Header from '../components/Header';

export default class ListaPropostasScene extends Component {
	render(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Propostas' />
				<Text>PROPOSTAS</Text>
			</View>
		)
	}
}