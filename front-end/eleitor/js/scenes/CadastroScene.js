import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Modal,
	Image,
	Picker,
	Text,
	TextInput,
	ScrollView,
	Platform,
	AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import TouchableElement from '../components/TouchableElement';
import CustomPicker from '../components/CustomPicker';
import LoadingOverlay from '../components/LoadingOverlay';
import SuccessOverlay from '../components/SuccessOverlay';
import Header from '../components/Header';
import dismissKeyboard from 'dismissKeyboard';
import HomeScene from './HomeScene';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigationManager from '../navigation/NavigationManager';
import ApiCall from '../api/ApiCall';
import {connect} from 'react-redux';
import {setToken} from '../redux/actions/token';

class CadastroScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nameText: this.props.name ? this.props.name : '',
			emailText: this.props.email ? this.props.email : '',
			cityText: this.props.city ? this.props.city : '',
			stateText: this.props.state ? this.props.state : '',
			ageText: this.props.age ? this.props.age : '',
			genderText: this.props.gender ? this.props.gender : '',
			pictureText: this.props.picture,
			passwordText: '',
			password2Text: '',
			nameError: false,
			emailError: false,
			cityError: false,
			stateError: false,
			ageError: false,
			genderError: false,
			passwordError: false,
			password2Error: false,
			fbIDText: this.props.id,
			isUsingFB: this.props.id ? true : false,
			loadingIndex: -10,
			successIndex: -10
		}

		this.showPasswordFields = this.showPasswordFields.bind(this);
		this.showSuccessOverlay = this.showSuccessOverlay.bind(this);
	}

	showPasswordFields() {
		if (!this.state.isUsingFB) {
			const deviceHeight = Platform.select({
				ios: 28,
				android: 35
			})
			return (
				<View>
					<View style={{flexDirection: 'row'}}>	
						<Icon name='vpn-key' size={24} style={{alignSelf: 'center', marginRight: 10}} color='black' />	
						<TextInput 
							ref={'password-input'}
							style={[styles.input, {height: deviceHeight, borderColor: this.state.passwordError ? 'red' : 'lightgray'}]}
							autoCapitalize='none'							
							secureTextEntry={true}
							autoCorrect={false}
							enablesReturnKeyAutomatically={true}
							keyboardAppearance='default'
							returnKeyType='next'
							underlineColorAndroid='transparent'
							numberOfLines={1}
							placeholder='Senha'
							onChangeText={(text) => this.setState({passwordText: text})}
							onSubmitEditing={() => this.refs['password2-input'].focus()}
							/>	
					</View>
					<View style={{flexDirection: 'row'}}>	
						<Icon name='vpn-key' size={24} style={{alignSelf: 'center', marginRight: 10}} color='black' />	
						<TextInput 
							ref={'password2-input'}
							style={[styles.input, {height: deviceHeight, borderColor: this.state.password2Error ? 'red' : 'lightgray'}]}
							autoCapitalize='none'							
							secureTextEntry={true}
							autoCorrect={false}
							enablesReturnKeyAutomatically={true}
							keyboardAppearance='default'
							returnKeyType='done'
							underlineColorAndroid='transparent'
							numberOfLines={1}
							placeholder='Confirme a senha'
							onChangeText={(text) => this.setState({password2Text: text})}
							onSubmitEditing={() => dismissKeyboard()}
							/>	
					</View>
				</View>
			)
		}
	}

	render(){
		const agesArray = Array.apply(null, Array(55)).map(function (_, i) {return i+16;});
		let agesPickerItems = agesArray.map((age, ii) => (
			<Picker.Item label={age.toString()} color="rgba(0,0,0,.87)" value={age} key={age.toString()}/>
		));
		agesPickerItems.unshift(<Picker.Item color="rgba(0,0,0,.2)" label="Idade" value="" key={Math.random()}/>);
		const deviceHeight = Platform.select({
			ios: 28,
			android: 35
		})
		const devicePaddingTop = Platform.select({
			android: -7
		})
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Cadastro' />
				<KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'white'}}>
					<View style={styles.view}>
						<View style={{alignItems: 'center', borderBottomColor: 'black', borderBottomWidth: 2, paddingBottom: 15}}>
							<View style={{width: 140, height: 112}}>
								<View style={styles.roundedView}>
									<Image
										style={styles.roundedImage}
										source={this.state.pictureText ? {uri: this.state.pictureText} : require('../resources/image/placeholder.png')}/>
								</View>
								<TouchableElement onPress={() => this.onChangePhotoPress()} style={styles.line}>
									<Text style={{color: 'black'}}>Escolher uma foto</Text>
								</TouchableElement>
							</View>
						</View>	
						<View style={{paddingTop: 15}}>
							<Text style={{marginVertical: 10, fontWeight: 'bold'}}>Informações pessoais:</Text>
							<View style={{flexDirection: 'row'}}>
								<Icon name='account-box' size={24} style={{alignSelf: 'center', marginRight: 10}} color='black' />	
								<TextInput 
									ref={'name-input'}
									style={[styles.input, {height: deviceHeight, borderColor: this.state.nameError ? 'red' : 'lightgray'}]}
									autoCapitalize='words'							
									autoCorrect={false}
									enablesReturnKeyAutomatically={true}
									keyboardAppearance='default'
									returnKeyType='next'
									underlineColorAndroid='transparent'
									numberOfLines={1}
									value={this.state.nameText}
									placeholder='Nome' 
									onChangeText={(text) => this.setState({nameText: text})}
									onSubmitEditing={() => this.refs['email-input'].focus()}
									/>	
							</View>	
							<View style={{flexDirection: 'row'}}>	
								<Icon name='email' size={24} style={{alignSelf: 'center', marginRight: 10}} color='black' />	
								<TextInput 
									ref={'email-input'}
									style={[styles.input, {height: deviceHeight, borderColor: this.state.emailError ? 'red' : 'lightgray'}]}
									autoCapitalize='none'							
									autoCorrect={false}
									enablesReturnKeyAutomatically={true}
									keyboardAppearance='default'
									returnKeyType='next'
									underlineColorAndroid='transparent'
									numberOfLines={1}
									value={this.state.emailText}
									placeholder='Email'
									onChangeText={(text) => this.setState({emailText: text})}
									onSubmitEditing={() => this.refs['password-input'].focus()}
									/>	
							</View>
							{this.showPasswordFields()}
							<View style={{flexDirection: 'row'}} >
								<Icon name='cake' size={24} style={{alignSelf: 'center', marginRight: 10}} color='black' />	
								<View style={[styles.picker, {height: deviceHeight, borderColor: this.state.ageError ? 'red' : 'lightgray', paddingTop: devicePaddingTop}]}>
									<CustomPicker
										mode='dropdown'
										selectedValue={this.state.ageText}
										onValueChange={(age) => this.setState({ageText: age})}>
										{agesPickerItems}
									</CustomPicker>
								</View>
								<Icon name='wc' size={24} style={{alignSelf: 'center', marginRight: 10, marginLeft: 20}} color='black' />	
								<View style={[styles.picker, {height: deviceHeight, borderColor: this.state.genderError ? 'red' : 'lightgray', paddingTop: devicePaddingTop}]}>
									<CustomPicker
										mode='dropdown'
										selectedValue={this.state.genderText}
										onValueChange={(gender) => this.setState({genderText: gender})}>
										<Picker.Item color="rgba(0,0,0,.2)" label="Sexo" value="" />							
										<Picker.Item color="rgba(0,0,0,.87)" label="Feminino" value="Feminino" />							
										<Picker.Item color="rgba(0,0,0,.87)" label="Masculino" value="Masculino" />
									</CustomPicker>
								</View>
							</View>
							<Text style={{marginVertical: 10, fontWeight: 'bold'}}>Estado e Cidade em que vota:</Text>
							<View style={{flexDirection: 'row'}} >
								<Icon name='map' size={24} style={{alignSelf: 'center', marginRight: 10}} color='black' />	
								<View style={[styles.picker, {height: deviceHeight, borderColor: this.state.stateError ? 'red' : 'lightgray', paddingTop: devicePaddingTop}]}>
									<CustomPicker
										mode='dropdown'
										selectedValue={this.state.stateText}
										onValueChange={(state) => this.setState({stateText: state})}>
										<Picker.Item color="rgba(0,0,0,.2)" label="Estado" value="" />							
										<Picker.Item color="rgba(0,0,0,.87)" label="SP" value="SP" />							
										<Picker.Item color="rgba(0,0,0,.87)" label="RJ" value="RJ" />
									</CustomPicker>
								</View>
								<Icon name='location-on' size={24} style={{alignSelf: 'center', marginRight: 10, marginLeft: 20}} color='black' />	
								<View style={[styles.picker, {height: deviceHeight, borderColor: this.state.cityError ? 'red' : 'lightgray', paddingTop: devicePaddingTop}]}>
									<CustomPicker
										mode='dropdown'
										selectedValue={this.state.cityText}
										onValueChange={(city) => this.setState({cityText: city})}>
										<Picker.Item color="rgba(0,0,0,.2)" label="Cidade" value="" />							
										<Picker.Item color="rgba(0,0,0,.87)" label="São Paulo" value="São Paulo" />							
										<Picker.Item color="rgba(0,0,0,.87)" label="Rio de Janeiro" value="Rio de Janeiro" />
									</CustomPicker>
								</View>
							</View>
						</View>
						<View style={styles.box}>
							<TouchableElement onPress={this.onSavePress.bind(this)} style={styles.button}>
								<Text style={{fontWeight: 'bold', color: 'white'}}>Salvar</Text>
							</TouchableElement>
						</View>
					</View>	
				</KeyboardAwareScrollView>
				<LoadingOverlay style={{zIndex: this.state.loadingIndex}}/>
				<SuccessOverlay style={{zIndex: this.state.successIndex}}/>
			</View>
		)
	}

	onChangePhotoPress() {
		const options = {
			title: 'Mudar de foto'
		};

		console.log('onChangePhotoPress');
		
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				// You can display the image using either data...
				// const source = 'data:image/jpeg;base64,' + response.data;

				// or a reference to the platform specific asset location
				let source = '';
				if (Platform.OS === 'ios') {
					source = response.uri.replace('file://', '');
				} else {
					source = response.uri;
				}

				this.setState({pictureText: source});
			}
		});
	}

	onSavePress() {
		this.setState({loadingIndex: 10});
		dismissKeyboard();
		
		let nameError = false;
		let emailError = false;
		let cityError = false;
		let stateError = false;
		let ageError = false;
		let genderError = false;
		let passwordError = false;
		let password2Error = false;
		let passwordTextMatch = false;

		if (this.state.nameText === '') {
			nameError = true;
		}
		if (this.state.emailText === '') {
			emailError = true;
		} 
		if (this.state.cityText === '') {
			cityError = true;
		} 
		if (this.state.stateText === '') {
			stateError = true;
		} 
		if (this.state.ageText === '') {
			ageError = true;
		} 
		if (this.state.genderText === '') {
			genderError = true;
		} 
		if (this.state.passwordText === '' && !this.state.isUsingFB) {
			passwordError = true;
		} 
		if (this.state.password2Text === '' && !this.state.isUsingFB) {
			password2Error = true;
		} 
		if (!passwordError && !password2Error && this.state.passwordText === this.state.password2Text) {
			passwordTextMatch = true;
		} else {
			password2Error = true;
		}

		this.setState({nameError: nameError, emailError: emailError, cityError: cityError, stateError: stateError, ageError: ageError, genderError: genderError, passwordError: passwordError,  password2Error: password2Error}, () => {
			if (!nameError && !emailError && !cityError && !stateError && !ageError && !genderError && !passwordError && !password2Error && passwordTextMatch) {
				this.getCadastro();
			} else {
				this.setState({loadingIndex: -10});
			}
		})
	}

	getCadastro() {
		var options = {
			name: this.state.nameText,
			email: this.state.emailText,
			state: this.state.stateText,
			city: this.state.cityText,
			age: this.state.ageText,
			gender: this.state.genderText,
			photo_url: this.state.pictureText
		};
		this.state.isUsingFB ? option.profile_id = this.state.fbIDText : options.password = this.state.passwordText;
		ApiCall('login/cadastrar', options, (jsonResponse) => {
			this.setState({loadingIndex: -10});
			this.showSuccessOverlay(jsonResponse.token);
			this.saveCredentials(jsonResponse);
		}, (failedRequest) => {
			this.setState({loadingIndex: -10});
			if (failedRequest.status === 400) {
				alert("Email já cadastrado no sistema.")
			} else {
				alert('Erro: não foi possível conectar ao servidor.');
			}
		});
	}

	saveCredentials(jsonResponse) {
		AsyncStorage.multiSet([
			['name', jsonResponse.name], 
			['email', jsonResponse.email], 
			['state', jsonResponse.state], 
			['city', jsonResponse.city], 
			['age', jsonResponse.age], 
			['gender', jsonResponse.gender], 
			['picture', jsonResponse.photo_url ? jsonResponse.photo_url : this.state.pictureText ? this.state.pictureText : ''], 
			['token', jsonResponse.token]
		]);
	}

	showSuccessOverlay(token) {
		this.setState({successIndex: 10})
		setTimeout(()=>{
			this.setState({successIndex: -10});
			this.props.navigator.replace({component: NavigationManager});
			this.props.setToken(token);
		}, 1500);
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

export default connect(mapStateToProps, mapDispatchToProps)(CadastroScene);

const styles = StyleSheet.create({
	view: {
		padding: 15,
		flexDirection: 'column',
		flex: 1
	},
	roundedImage: {
		width: 100, 
		height: 100, 
		borderRadius: 50, 
		alignSelf: 'center',
		borderColor: 'black'
	},
	roundedView: {
		width: 102, 
		height: 102, 
		borderRadius: 51, 
		borderWidth: 1,
		alignSelf: 'center',
		borderColor: 'black'
	},
	line: {
		position: 'absolute',
		bottom: 0,
		width: 140,
		height: 30,
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 3,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white'
	},
	input: {
		marginVertical: 10, 
		height: 30, 
		borderColor: 'lightgray', 
		borderWidth: 1, 
		borderRadius: 3, 
		backgroundColor: 'white', 
		flexDirection: 'row', 
		flex: 1,
		padding: 5
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
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#33CCCC'
	},
	picker: {
		flex: 1, 
		borderColor: 'lightgray', 
		borderWidth: 1, 
		borderRadius: 3, 
		marginVertical: 10
	}
})