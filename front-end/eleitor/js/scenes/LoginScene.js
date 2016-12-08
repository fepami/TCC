import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Modal,
	Image,
	Text,
	TextInput,
	Platform,
	AsyncStorage
} from 'react-native';
import TouchableElement from '../components/TouchableElement';
import LoadingOverlay from '../components/LoadingOverlay';
import CadastroScene from './CadastroScene';
import HomeScene from './HomeScene';
import FBSDK from 'react-native-fbsdk';
import NavigationManager from '../navigation/NavigationManager';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dismissKeyboard from 'dismissKeyboard';

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
			emailText: 'marcela_teste@eleitor.com',
			passwordText: '123',
			emailError: false,
			passwordError: false,
			user: {},
			loadingIndex: -10
		}

		this.saveCredentials = this.saveCredentials.bind(this);
		this.getLogin = this.getLogin.bind(this);
	}

	render(){
		const deviceHeight = Platform.select({
			ios: 28,
			android: 35
		})

		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'white', padding: 15}}>
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
							autoCapitalize='none'							
							autoCorrect={false}
							enablesReturnKeyAutomatically={true}
							keyboardAppearance='default'
							keyboardType='email-address'
							returnKeyType='next'
							underlineColorAndroid='transparent'
							numberOfLines={1}
							onChangeText={(text) => this.setState({emailText: text})}
							onSubmitEditing={() => this.refs['password-input'].focus()}
							value='marcela_teste@eleitor.com'
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
							value='123'
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
								onLogoutFinished={() => console.log("User logged out")}/>
							</View>
					</View>	
					<TouchableElement onPress={this.onNewAccountPress.bind(this)} style={{alignSelf: 'center', height: 40, justifyContent: 'center'}}>
						<Text>Criar uma conta</Text>
					</TouchableElement>
				</KeyboardAwareScrollView>
				<LoadingOverlay style={{zIndex: this.state.loadingIndex, top: 0}}/>
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
					this.setState({loadingIndex: 10, user: {name: result.name, email: result.email, gender: (result.gender === 'female') ? 'Feminino' : 'Masculino', picture: result.picture.data.url, age: age, id: result.id}}, this.getLogin('fb', result.email, result.id));
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
			
			// AccessToken.getCurrentAccessToken().then(
			// 	(data) => {
			// 		this.setState({token: data.accessToken}, () => console.log(this.state.token));
			// 	}
			// )
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
		this.setState({loadingIndex: 10});
		dismissKeyboard();
		
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
				this.getLogin('manual', this.state.emailText, this.state.passwordText);
			} else {
				this.setState({loadingIndex: -10});
			}
		})
	}

	getLogin(type, email, param) {
		var request = new XMLHttpRequest();
		var _this = this;
		request.onreadystatechange = (e) => {
			if (request.readyState !== 4) {
				return;
			}

			_this.setState({loadingIndex: -10});
			if (request.status === 200) {
				const jsonResponse = JSON.parse(request.response);
				_this.saveCredentials(jsonResponse);
			} else if (request.status === 404) {
				alert("Email ou senha incorreto.")
			} else if (request.status === 418) {
				console.log("I'm a teapot! I should be brewing!")
				_this.props.navigator.push({component: CadastroScene, passProps: _this.state.user});
			} else {
				console.warn('Erro: não foi possível conectar ao servidor.');
			}
		};

		if (type === 'fb') {
			request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/login?email=' + email + '&profile_id=' + param);
		} else {
			request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/login?email=' + email + '&password=' + param);
		}
		request.send();
	}

	saveCredentials(jsonResponse) {
		AsyncStorage.multiSet([
			['name', jsonResponse.name], 
			['email', jsonResponse.email], 
			['state', jsonResponse.state], 
			['city', jsonResponse.city], 
			['age', jsonResponse.age.toString()], 
			['gender', jsonResponse.gender], 
			['picture', jsonResponse.photo_url ? jsonResponse.photo_url : this.state.user.picture ? this.state.user.picture : ''], 
			['token', jsonResponse.token]
		], this.props.navigator.replace({component: NavigationManager}));
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