import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import Header from '../components/Header';

export default class UsuarioSobreScene extends Component {
	render(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Sobre o Aplicativo' />
				<View style={styles.view}>
					<Text>Sobre o Aplicativo</Text>					
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