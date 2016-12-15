import React, {Component} from 'react';
import {
	Alert,
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
import LoginEsqueciSenhaScene from './LoginEsqueciSenhaScene';
import HomeScene from './HomeScene';
import FBSDK from 'react-native-fbsdk';
import NavigationManager from '../navigation/NavigationManager';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dismissKeyboard from 'dismissKeyboard';
import ApiCall from '../api/ApiCall';
import {connect} from 'react-redux';
import {setToken} from '../redux/actions/token';

const {
	LoginButton,
	AccessToken,
	GraphRequest,
	GraphRequestManager,
} = FBSDK;

class LoginScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emailText: '',
			passwordText: '',
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
					<View style={{alignItems: 'center', paddingTop: 10}}>
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
							value={this.state.emailText}
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
							value={this.state.passwordText}
							/>	
					</View>
					<View style={styles.box}>
						<View style={{flex: 1, flexDirection: 'column'}}>
							<TouchableElement onPress={this.onLoginPress.bind(this)} style={styles.button}>
								<Text style={{fontWeight: 'bold', color: 'white'}}>Entrar</Text>
							</TouchableElement>
							<LoginButton
								style={{flex: 1, height: 40, marginTop: 15}}
								readPermissions={['public_profile', 'email', 'user_birthday']}
								onLoginFinished={this.onFBLoginFinished.bind(this)}
								onLogoutFinished={() => console.log('Usuário deslogado do Facebook')}/>
							</View>
					</View>	
					<TouchableElement onPress={this.onNewAccountPress.bind(this)} style={{alignSelf: 'center', height: 40, justifyContent: 'center'}}>
						<Text style={{color: 'blue'}}>Criar uma conta</Text>
					</TouchableElement>
					<TouchableElement onPress={this.onPasswordPress.bind(this)} style={{alignSelf: 'center', height: 40, justifyContent: 'center'}}>
						<Text style={{color: 'blue'}}>Esqueci a senha</Text>
					</TouchableElement>
				</KeyboardAwareScrollView>
				<LoadingOverlay style={{zIndex: this.state.loadingIndex, top: 0}}/>
			</View>
		)
	}

	onFBLoginFinished(error, result) {
		if (error) {
			Alert.alert('Erro', 'Erro de autenticação com Facebook.');
		} else if (result.isCancelled) {
			Alert.alert('Erro', 'Login com Facebook cancelado.');
		} else {
			var _responseInfoCallback = (error: ?Object, result: ?Object) => {
				if (error) {
					Alert.alert('Erro', 'Erro de autenticação com Facebook.');
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
		var options = {};
		options.email = email;
		type === 'fb' ? options.profile_id = param : options.password = param;
		ApiCall('login', options, (jsonResponse) => {
			this.setState({loadingIndex: -10});
			this.saveCredentials(jsonResponse);
		}, (failedRequest) => {
			this.setState({loadingIndex: -10});
			if (failedRequest.status === 404) {
				Alert.alert('Erro', 'Email ou senha incorreto.')
			} else if (failedRequest.status === 418) {
				console.log("I'm a teapot! I should be brewing!")
				this.props.navigator.push({component: CadastroScene, passProps: this.state.user});
			} else {
				Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
			}
		});
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
		], () => {
			this.props.navigator.replace({component: NavigationManager});
			this.props.setToken(jsonResponse.token);
		});

	}

	onNewAccountPress() {
		this.props.navigator.push({component: CadastroScene});
	}

	onPasswordPress() {
		this.props.navigator.push({component: LoginEsqueciSenhaScene});
	}
}

function mapStateToProps(store) {
	return {
		token: store.token.token
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setToken: token => dispatch(setToken(token))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScene);

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
		paddingTop: 10,
		paddingBottom: 15,
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
	image: {
		width: 150,
		height: 150
	}
})