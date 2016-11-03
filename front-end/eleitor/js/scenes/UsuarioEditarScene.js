import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import Header from '../components/Header';

export default class UsuarioEditarScene extends Component {
	render(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Editar Perfil' />
				<View style={styles.view}>
					<Text>Editar Perfil</Text>					
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