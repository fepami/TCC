import React, {Component} from 'react';
import {
	Alert,
	StyleSheet,
	View,
	ScrollView,
	TextInput,
	Text,
	Platform
} from 'react-native';
import Header from '../components/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ApiCall from '../api/ApiCall';

export default class LoginEsqueciSenhaScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emailText: '',
			emailError: false
		}
	}
	render(){
		const deviceHeight = Platform.select({
			ios: 28,
			android: 35
		})

		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Esqueci a Senha' />
				<KeyboardAwareScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<Text>Email:</Text>
						<TextInput 
							ref={'email-input'}
							style={[styles.input, {height: deviceHeight, borderColor: this.state.emailError ? 'red' : 'lightgray'}]}
							autoCapitalize='none'							
							autoCorrect={false}
							enablesReturnKeyAutomatically={true}
							keyboardAppearance='default'
							keyboardType='email-address'
							returnKeyType='done'
							underlineColorAndroid='transparent'
							numberOfLines={1}
							onChangeText={(text) => this.setState({emailText: text})}
							onSubmitEditing={this.onPress.bind(this)}
							/>
						<View style={styles.box}>
							<TouchableElement onPress={this.onPress.bind(this)} style={styles.button}>
								<Text style={{fontWeight: 'bold', color: 'white'}}>Enviar</Text>
							</TouchableElement>
						</View>
					</View>
				</KeyboardAwareScrollView>
			</View>
		)
	}

	onPress() {
		let emailError = false;

		if (this.state.emailText === '') {
			emailError = true;
		}

		this.setState({emailError: emailError}, () => {
			if (!emailError) {
				this.callEsqueciAsenha();
			}	
		})
	}

	callEsqueciAsenha(newPhotoURL) {
		var options = {
			email: this.state.emailText,
		};
		ApiCall(`usuario/esqueceu_senha`, options, (jsonResponse) => {
			Alert.alert('Atenção', 'Uma nova senha foi enviada para o seu email.');
		}, (failedRequest) => {
			Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
		});
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
		borderWidth: 1, 
		borderRadius: 3, 
		backgroundColor: 'white', 
		flexDirection: 'row', 
		flex: 1,
		padding: 5
	},
	box: {
		paddingVertical: 15,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		flex: 1,
		height: 40,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#33CCCC'
	},
})