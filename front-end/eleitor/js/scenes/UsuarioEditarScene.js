import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Picker,
	Text,
	TextInput,
	ScrollView,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import TouchableElement from '../components/TouchableElement';
import CustomPicker from '../components/CustomPicker';
import Header from '../components/Header';
import dismissKeyboard from 'dismissKeyboard';
import HomeScene from './HomeScene';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class UsuarioEditarScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nomeText: this.props.nome ? this.props.nome : '',
			emailText: this.props.email ? this.props.email : '',
			cidadeText: this.props.cidade ? this.props.cidade : '',
			estadoText: this.props.estado ? this.props.estado : '',
			idadeText: this.props.idade ? this.props.idade : '',
			sexoText: this.props.sexo ? this.props.sexo : '',
			fotoText: this.props.foto,
			nomeError: false,
			emailError: false,
			cidadeError: false,
			estadoError: false,
			idadeError: false,
			sexoError: false
		}
	}

	render(){
		const agesArray = Array.apply(null, Array(55)).map(function (_, i) {return i+16;});
		let agesPickerItems = agesArray.map((age, ii) => (
			<Picker.Item label={age.toString()} color="rgba(0,0,0,.87)" value={age.toString()} key={age.toString()}/>
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
					title='Editar Perfil' />
				<KeyboardAwareScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<View style={{alignItems: 'center', borderBottomColor: 'black', borderBottomWidth: 2, paddingBottom: 15}}>
							<View style={{width: 110, height: 112}}>
								<View style={styles.roundedView}>
									<Image
										style={styles.roundedImage}
										source={this.state.fotoText}/>
								</View>
								<TouchableElement onPress={() => this.onChangePhotoPress()} style={styles.line}>
									<Text style={{color: 'black'}}>Mudar a foto</Text>
								</TouchableElement>
							</View>
						</View>	
						<View style={{paddingTop: 15}}>
							<Text style={{marginVertical: 10, fontWeight: 'bold'}}>Informações pessoais:</Text>
							<View style={{flexDirection: 'row'}}>
								<Icon name='account-box' size={24} style={{alignSelf: 'center', marginRight: 10}} color='black' />	
								<TextInput 
									ref={'name-input'}
									style={[styles.input, {height: deviceHeight, borderColor: this.state.nomeError ? 'red' : 'lightgray'}]}
									autoCapitalize='words'							
									autoCorrect={false}
									enablesReturnKeyAutomatically={true}
									keyboardAppearance='default'
									returnKeyType='next'
									underlineColorAndroid='transparent'
									numberOfLines={1}
									value={this.state.nomeText}
									placeholder='Nome' 
									onChangeText={(text) => this.setState({nomeText: text})}
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
									onSubmitEditing={() => dismissKeyboard()}
									/>	
							</View>
							<View style={{flexDirection: 'row'}} >
								<Icon name='cake' size={24} style={{alignSelf: 'center', marginRight: 10}} color='black' />	
								<View style={[styles.picker, {height: deviceHeight, borderColor: this.state.idadeError ? 'red' : 'lightgray', paddingTop: devicePaddingTop}]}>
									<CustomPicker
										mode='dropdown'
										selectedValue={this.state.idadeText}
										onValueChange={(age) => this.setState({idadeText: age})}>
										{agesPickerItems}
									</CustomPicker>
								</View>
								<Icon name='wc' size={24} style={{alignSelf: 'center', marginRight: 10, marginLeft: 20}} color='black' />	
								<View style={[styles.picker, {height: deviceHeight, borderColor: this.state.sexoError ? 'red' : 'lightgray', paddingTop: devicePaddingTop}]}>
									<CustomPicker
										mode='dropdown'
										selectedValue={this.state.sexoText}
										onValueChange={(gender) => this.setState({sexoText: gender})}>
										<Picker.Item color="rgba(0,0,0,.2)" label="Sexo" value="" />							
										<Picker.Item color="rgba(0,0,0,.87)" label="Feminino" value="Feminino" />							
										<Picker.Item color="rgba(0,0,0,.87)" label="Masculino" value="Masculino" />
									</CustomPicker>
								</View>
							</View>
							<Text style={{marginVertical: 10, fontWeight: 'bold'}}>Estado e cidade em que vota:</Text>
							<View style={{flexDirection: 'row'}} >
								<Icon name='map' size={24} style={{alignSelf: 'center', marginRight: 10}} color='black' />	
								<View style={[styles.picker, {height: deviceHeight, borderColor: this.state.estadoError ? 'red' : 'lightgray', paddingTop: devicePaddingTop}]}>
									<CustomPicker
										mode='dropdown'
										selectedValue={this.state.estadoText}
										onValueChange={(state) => this.setState({estadoText: state})}>
										<Picker.Item color="rgba(0,0,0,.2)" label="Estado" value="" />							
										<Picker.Item color="rgba(0,0,0,.87)" label="SP" value="SP" />							
										<Picker.Item color="rgba(0,0,0,.87)" label="RJ" value="RJ" />
									</CustomPicker>
								</View>
								<Icon name='location-on' size={24} style={{alignSelf: 'center', marginRight: 10, marginLeft: 20}} color='black' />	
								<View style={[styles.picker, {height: deviceHeight, borderColor: this.state.cidadeError ? 'red' : 'lightgray', paddingTop: devicePaddingTop}]}>
									<CustomPicker
										mode='dropdown'
										selectedValue={this.state.cidadeText}
										onValueChange={(city) => this.setState({cidadeText: city})}>
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
				const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

				// or a reference to the platform specific asset location
				if (Platform.OS === 'ios') {
					const source = {uri: response.uri.replace('file://', ''), isStatic: true};
				} else {
					const source = {uri: response.uri, isStatic: true};
				}

				this.setState({fotoText: source});
			}
		});
	}

	onSavePress() {
		let nomeError = false;
		let emailError = false;
		let cidadeError = false;
		let estadoError = false;
		let idadeError = false;
		let sexoError = false;

		if (this.state.nomeText === '') {
			nomeError = true;
		}
		if (this.state.emailText === '') {
			emailError = true;
		} 
		if (this.state.cidadeText === '') {
			cidadeError = true;
		} 
		if (this.state.estadoText === '') {
			estadoError = true;
		} 
		if (this.state.idadeText === '') {
			idadeError = true;
		} 
		if (this.state.sexoText === '') {
			sexoError = true;
		}

		this.setState({nomeError: nomeError, emailError: emailError, cidadeError: cidadeError, estadoError: estadoError, idadeError: idadeError, sexoError: sexoError}, () => {
			if (!nomeError && !emailError && !cidadeError && !estadoError && !idadeError && !sexoError) {
				this.props.navigator.push({component: HomeScene});
			}	
		})
	}
}

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
		width: 110,
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