import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TextInput,
	Platform
} from 'react-native';
import TouchableElement from '../components/TouchableElement';
import CadastroScene from '../scenes/CadastroScene';
import HomeScene from '../scenes/HomeScene';
import FBSDK from 'react-native-fbsdk';
const {
	LoginButton,
	AccessToken,
	GraphRequest,
	GraphRequestManager,
} = FBSDK;

export default class LoginScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emailText: '',
			passwordText: '',
			emailError: false,
			passwordError: false
		}
	}

	render(){
		const deviceHeight = Platform.select({
			ios: 28,
			android: 35
		})

		return(
			<View style={{flex: 1, backgroundColor: 'white', padding: 15}}>
				<View style={{alignItems: 'center', paddingTop: 30}}>
					<Image
						style={styles.image}
						source={require('../resources/image/logo.png')} />
					<Text style={styles.h1}>e-leitor</Text>
				</View>	
				<View style={{paddingTop: 20}}>
					<Text>Email:</Text>
					<TextInput 
						ref={'email-input'}
						style={[styles.input, {height: deviceHeight, borderColor: this.state.emailError ? 'red' : 'lightgray'}]}
						autoCapitalize='words'							
						autoCorrect={false}
						enablesReturnKeyAutomatically={true}
						keyboardAppearance='default'
						keyboardType='email-address'
						returnKeyType='next'
						underlineColorAndroid='transparent'
						numberOfLines={1}
						onChangeText={(text) => this.setState({emailText: text})}
						onSubmitEditing={() => this.refs['password-input'].focus()}
						/>	
					<Text>Senha:</Text>
					<TextInput 
						ref={'password-input'}
						style={[styles.input, {height: deviceHeight, borderColor: this.state.passwordError ? 'red' : 'lightgray'}]}
						autoCapitalize='none'							
						secureTextEntry={true}
						autoCorrect={false}
						enablesReturnKeyAutomatically={true}
						keyboardAppearance='default'
						returnKeyType='done'
						underlineColorAndroid='transparent'
						numberOfLines={1}
						onChangeText={(text) => this.setState({passwordText: text})}
						onSubmitEditing={this.onLoginPress.bind(this)}
						/>	
				</View>
				<View style={styles.box}>
					<View style={{flex: 1, flexDirection: 'column'}}>
						<TouchableElement onPress={this.onLoginPress.bind(this)} style={styles.button}>
							<Text>Entrar</Text>
						</TouchableElement>
						<LoginButton
							style={{flex: 1, height: 40, marginTop: 15}}
							readPermissions={['public_profile', 'email', 'user_birthday']}
							onLoginFinished={this.onFBLoginFinished.bind(this)}
							onLogoutFinished={() => alert("User logged out")}/>
						</View>
				</View>	
				<TouchableElement onPress={this.onNewAccountPress.bind(this)} style={{alignSelf: 'center', height: 40, justifyContent: 'center'}}>
					<Text>Criar uma conta</Text>
				</TouchableElement>
			</View>
		)
	}

	onFBLoginFinished(error, result) {
		if (error) {
			alert('Erro de autenticação');
		} else if (result.isCancelled) {
			alert('Login cancelado');
		} else {
			var _responseInfoCallback = (error: ?Object, result: ?Object) => {
				if (error) {
					alert('Erro de autenticação');
				} else {
					const age = this.getAge(result.birthday);
					this.setState({usuario: {nome: result.name, email: result.email, sexo: result.gender, foto: result.picture.data.url, idade: age}}, () => console.log(this.state.usuario));
				}
			}

			// Create a graph request asking for user information with a callback to handle the response.
			const infoRequest = new GraphRequest(
				'/me?locale=en_US&fields=name,gender,picture.type(large),email,birthday',
				null,
				_responseInfoCallback,
			);
			// Start the graph request.
			new GraphRequestManager().addRequest(infoRequest).start();
			
			AccessToken.getCurrentAccessToken().then(
				(data) => {
					this.setState({token: data.accessToken}, () => console.log(this.state.token));
				}
			)
		}
	}

	getAge(dateString) {
		var today = new Date();
		var birthDate = new Date(dateString);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
		{
			age--;
		}
		return age;
	}

	onLoginPress() {
		let emailError = false;
		let passwordError = false;

		if (this.state.emailText === '') {
			emailError = true;
		} 

		if (this.state.passwordText === '') {
			passwordError = true;
		} 
		
		this.setState({emailError: emailError, passwordError: passwordError}, () => {
			if (!emailError && !passwordError) {
				this.props.navigator.push({component: HomeScene});
			}	
		})
	}

	onNewAccountPress() {
		this.props.navigator.push({component: CadastroScene});
	}
}

const styles = StyleSheet.create({
	view: {
		padding: 15,
		flexDirection: 'column',
	},
	h1: {
		fontSize: 32,
		fontWeight: 'bold'
	},
	input: {
		marginVertical: 10, 
		height: 30, 
		borderWidth: 1, 
		borderRadius: 3, 
		backgroundColor: 'white', 
		flexDirection: 'row', 
		flex: 1
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
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: 150,
		height: 150
	}
})