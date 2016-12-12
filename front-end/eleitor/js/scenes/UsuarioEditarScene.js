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
import Header from '../components/Header';
import dismissKeyboard from 'dismissKeyboard';
import HomeScene from './HomeScene';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingOverlay from '../components/LoadingOverlay';
import SuccessOverlay from '../components/SuccessOverlay';
import ApiCall from '../api/ApiCall';
import {connect} from 'react-redux';

class UsuarioEditarScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nameText: '',
			cityText: '',
			stateText: '',
			ageText: '',
			genderText: '',
			pictureText: '',
			nameError: false,
			cityError: false,
			stateError: false,
			ageError: false,
			genderError: false,
			loadingIndex: -10,
			successIndex: -10
		}
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.showSuccessOverlay = this.showSuccessOverlay.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({nameText: this.props.nameText, cityText: this.props.cityText, stateText: this.props.stateText, ageText: this.props.ageText, genderText: this.props.genderText, pictureText: this.props.pictureText});
	}

	closeModal(){
		this.props.changeModalVisibility(false);
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

		const cancelLeft = {
			icon: 'md-close',
			onPress: this.closeModal.bind(this)
		};
		const saveRight = [{
			title: 'Salvar',
			iconName: 'md-checkmark',
			show: 'always',
			onActionSelected: this.onSavePress.bind(this)
		}];
		const imageSource = (this.state.pictureText) && !['','null','undefined'].includes(this.state.pictureText) ? {uri: this.state.pictureText} : require('../resources/image/placeholder.png');

		return(
			<Modal 
				animationType={'slide'}
				transparent={false}
				visible={this.props.modalVisible}
				onRequestClose={() => this.props.changeModalVisibility(false)} >
				<View style={[Platform.select({android: styles.androidView}), {flex: 1, backgroundColor: 'white'}]}>
					<Header
						navigator={this.props.navigator}
						title='Editar Perfil' 
						actions={saveRight}
						leftItem={cancelLeft}/>
					<KeyboardAwareScrollView style={{flex: 1}}>
						<View style={styles.view}>
							<View style={{alignItems: 'center', borderBottomColor: 'black', borderBottomWidth: 2, paddingBottom: 15}}>
								<View style={{width: 110, height: 112}}>
									<View style={styles.roundedView}>
										<Image
											style={styles.roundedImage}
											source={imageSource}/>
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
										onSubmitEditing={() => dismissKeyboard()}
										/>	
								</View>	
								<View style={{flexDirection: 'row'}} >
									<Icon name='cake' size={24} style={{alignSelf: 'center', marginRight: 10}} color='black' />	
									<View style={[styles.picker, {height: deviceHeight, borderColor: this.state.ageError ? 'red' : 'lightgray', paddingTop: devicePaddingTop}]}>
										<CustomPicker
											ref={'age-picker'}
											mode='dropdown'
											selectedValue={this.state.ageText}
											onValueChange={(age) => this.setState({ageText: age})}>
											{agesPickerItems}
										</CustomPicker>
									</View>
									<Icon name='wc' size={24} style={{alignSelf: 'center', marginRight: 10, marginLeft: 20}} color='black' />	
									<View style={[styles.picker, {height: deviceHeight, borderColor: this.state.genderError ? 'red' : 'lightgray', paddingTop: devicePaddingTop}]}>
										<CustomPicker
											ref={'gender-picker'}
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
											ref={'state-picker'}
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
											ref={'city-picker'}
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
				</View>
				<LoadingOverlay style={{zIndex: this.state.loadingIndex}}/>
				<SuccessOverlay style={{zIndex: this.state.successIndex}}/>
			</Modal>
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
		let cityError = false;
		let stateError = false;
		let ageError = false;
		let genderError = false;

		if (this.state.nameText === '') {
			nameError = true;
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

		this.setState({nameError: nameError, cityError: cityError, stateError: stateError, ageError: ageError, genderError: genderError}, () => {
			if (!nameError && !cityError && !stateError && !ageError && !genderError) {
				this.getUpdateCadastro();
			} else {
				this.setState({loadingIndex: -10});
			}	
		})
	}

	getUpdateCadastro() {
		var options = {
			name: this.state.nameText,
			email: this.state.emailText,
			state: this.state.stateText,
			city: this.state.cityText,
			age: this.state.ageText,
			gender: this.state.genderText,
			photo_url: this.state.pictureText,
			token: this.props.token,
		};
		ApiCall(`usuario/editar`, options, (jsonResponse) => {
			this.setState({loadingIndex: -10});
			this.showSuccessOverlay();
			this.saveCredentials();
		}, (failedRequest) => {
			this.setState({loadingIndex: -10});
			alert('Erro: não foi possível conectar ao servidor.');
		});
	}

	saveCredentials() {
		AsyncStorage.multiSet([
			['name', this.state.nameText], 
			['state', this.state.stateText], 
			['city', this.state.cityText], 
			['age', this.state.ageText], 
			['gender', this.state.genderText], 
			['picture', this.state.pictureText ? this.state.pictureText : '']
		]);
	}

	showSuccessOverlay() {
		this.setState({successIndex: 10})
		setTimeout(()=>{
			this.setState({successIndex: -10});
			this.closeModal()
			this.props.callback && this.props.callback();
		}, 1500);
	}
}

function mapStateToProps(store) {
	return {
		token: store.token.token
	}
}

export default connect(mapStateToProps)(UsuarioEditarScene);

const styles = StyleSheet.create({
	androidView: {
		paddingTop: -25
	},
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