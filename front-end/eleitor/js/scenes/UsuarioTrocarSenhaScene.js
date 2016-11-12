import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	ScrollView,
	Platform
} from 'react-native';
import TouchableElement from '../components/TouchableElement';
import dismissKeyboard from 'dismissKeyboard';
import Header from '../components/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class UsuarioTrocarSenhaScene extends Component {
	render(){
		const deviceHeight = Platform.select({
			ios: 28,
			android: 35
		})
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Trocar a Senha' />
				<KeyboardAwareScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<Text>Senha antiga:</Text>	
						<TextInput 
							ref={'currentpwd'}
							style={[styles.input, {height: deviceHeight}]}
							autoCapitalize='none'
							secureTextEntry={true}
							autoCorrect={false}
							enablesReturnKeyAutomatically={true}
							keyboardAppearance='default'
							returnKeyType='next'
							underlineColorAndroid='transparent'
							numberOfLines={1}
							/>		
						<Text>Nova senha:</Text>	
						<TextInput 
							ref={'newpwd'}
							style={[styles.input, {height: deviceHeight}]}
							autoCapitalize='none'
							secureTextEntry={true}
							autoCorrect={false}
							enablesReturnKeyAutomatically={true}
							keyboardAppearance='default'
							returnKeyType='next'
							underlineColorAndroid='transparent'
							numberOfLines={1}
							/>				
						<Text>Confirmação da nova senha:</Text>	
						<TextInput 
							ref={'newpwd2'}
							style={[styles.input, {height: deviceHeight}]}
							autoCapitalize='none'
							secureTextEntry={true}
							autoCorrect={false}
							enablesReturnKeyAutomatically={true}
							keyboardAppearance='default'
							returnKeyType='done'
							underlineColorAndroid='transparent'
							numberOfLines={1}
							/>		
						<View style={styles.box}>
							<TouchableElement onPress={this.onPress.bind(this)} style={styles.button}>
								<Text>Salvar</Text>
							</TouchableElement>
						</View>
					</View>
				</KeyboardAwareScrollView>
			</View>
		)
	}

	onPress() {
		dismissKeyboard();
	}
}

const styles = StyleSheet.create({
	view: {
		padding: 15,
		flexDirection: 'column',
	},
	input: {
		marginVertical: 10, 
		height: 30, 
		borderColor: 'lightgray', 
		borderWidth: 1, 
		borderRadius: 3, 
		backgroundColor: 'white', 
		flexDirection: 'row', 
		flex: 1
	},
	box: {
		flex: 1,
		height: 80,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		flex: 1,
		height: 40,
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	}
})