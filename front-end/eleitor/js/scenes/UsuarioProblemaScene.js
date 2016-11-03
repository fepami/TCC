import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import Header from '../components/Header';

export default class UsuarioProblemaScene extends Component {
	render(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Reportar um Problema' />
				<View style={styles.view}>
					<Text>Reportar um Problema</Text>					
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	view: {
		padding: 15,
		flexDirection: 'column',
		flex: 1
	}
})