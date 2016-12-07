import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Modal,
	Text,
	TextInput,
	ScrollView,
	Platform,
	AsyncStorage
} from 'react-native';
import TouchableElement from '../components/TouchableElement';
import dismissKeyboard from 'dismissKeyboard';
import Header from '../components/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingOverlay from '../components/LoadingOverlay';

export default class UsuarioTrocarSenhaScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentpwdText: '',
			newpwdText: '',
			newpwd2Text: '',
			currentpwdError: false,
			newpwdError: false,
			newpwd2Error: false,
			loadingVisible: false
		}
	}

	closeModal(){
		this.props.changeModalVisibility(false);
	}

	componentDidMount() {
		var _this = this;
		AsyncStorage.getItem('token', (err, result) => {
			_this.setState({token: result});
		});
	}

	render(){
		const deviceHeight = Platform.select({
			ios: 28,
			android: 35
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

		return(
			<Modal 
				animationType={'slide'}
				transparent={false}
				visible={this.props.modalVisible}
				onRequestClose={() => this.props.changeModalVisibility(false)} >
				<View style={[Platform.select({android: styles.androidView}), {flex: 1, backgroundColor: 'white'}]}>
					<Header
						navigator={this.props.navigator}
						title='Trocar a Senha' 
						actions={saveRight}
						leftItem={cancelLeft} />
					<KeyboardAwareScrollView style={{flex: 1}}>
						<View style={styles.view}>
							<Text>Senha antiga:</Text>	
							<TextInput 
								ref={'currentpwd-input'}
								style={[styles.input, {height: deviceHeight, borderColor: this.state.currentpwdError ? 'red' : 'lightgray'}]}
								autoCapitalize='none'
								secureTextEntry={true}
								autoCorrect={false}
								enablesReturnKeyAutomatically={true}
								keyboardAppearance='default'
								returnKeyType='next'
								underlineColorAndroid='transparent'
								numberOfLines={1}
								onChangeText={(text) => this.setState({currentpwdText: text})}
								onSubmitEditing={() => this.refs['newpwd-input'].focus()} />		
							<Text>Nova senha:</Text>	
							<TextInput 
								ref={'newpwd-input'}
								style={[styles.input, {height: deviceHeight, borderColor: this.state.newpwdError ? 'red' : 'lightgray'}]}
								autoCapitalize='none'
								secureTextEntry={true}
								autoCorrect={false}
								enablesReturnKeyAutomatically={true}
								keyboardAppearance='default'
								returnKeyType='next'
								underlineColorAndroid='transparent'
								numberOfLines={1}
								onChangeText={(text) => this.setState({newpwdText: text})}
								onSubmitEditing={() => this.refs['newpwd2-input'].focus()} />				
							<Text>Confirmação da nova senha:</Text>	
							<TextInput 
								ref={'newpwd2-input'}
								style={[styles.input, {height: deviceHeight, borderColor: this.state.newpwd2Error ? 'red' : 'lightgray'}]}
								autoCapitalize='none'
								secureTextEntry={true}
								autoCorrect={false}
								enablesReturnKeyAutomatically={true}
								keyboardAppearance='default'
								returnKeyType='done'
								underlineColorAndroid='transparent'
								numberOfLines={1}
								onChangeText={(text) => this.setState({newpwd2Text: text})}
								onSubmitEditing={() => dismissKeyboard()} />		
							<View style={styles.box}>
								<TouchableElement onPress={this.onSavePress.bind(this)} style={styles.button}>
									<Text style={{fontWeight: 'bold', color: 'white'}}>Salvar</Text>
								</TouchableElement>
							</View>
						</View>
					</KeyboardAwareScrollView>
				</View>
				<Modal
					animationType={'fade'}
					transparent={true}
					visible={this.state.loadingVisible}
					onRequestClose={() => this.state.setState({loadingVisible: false})} >
					<LoadingOverlay style={{backgroundColor: 'rgba(0,0,0,0.5)'}}/>
				</Modal>
			</Modal>
		)
	}

	onSavePress() {
		this.setState({loadingVisible: true});
		dismissKeyboard();
		
		let currentpwdError = false;
		let newpwdError = false;
		let newpwd2Error = false;
		let newpwdTextMatch = false;
		
		if (this.state.currentpwdText === '') {
			currentpwdError = true;
		}
		if (this.state.newpwdText === '') {
			newpwdError = true;
		} 
		if (this.state.newpwd2Text === '') {
			newpwd2Error = true;
		}
		if (!newpwdError && !newpwd2Error && this.state.newpwdText === this.state.newpwd2Text) {
			newpwdTextMatch = true;
		} else {
			newpwd2Error = true;
		}

		this.setState({currentpwdError: currentpwdError, newpwdError: newpwdError, newpwd2Error: newpwd2Error}, () => {
			if (!currentpwdError && !newpwdError && !newpwd2Error && newpwdTextMatch) {
				this.getTrocarSenha();
			} else {
				this.setState({loadingVisible: false});
			}
		})
	}

	getTrocarSenha() {
		var request = new XMLHttpRequest();
		var _this = this;
		request.onreadystatechange = (e) => {
			_this.setState({loadingVisible: false});

			if (request.readyState !== 4) {
				return;
			}

			if (request.status === 200) {
				// alert("Nova senha salva com sucesso!");
				_this.props.changeModalVisibility(false);
			} else if (request.status === 404) {
				alert("Senha antiga incorreta.")
			} else {
				console.warn('Erro: não foi possível conectar ao servidor.');
			}
		};

		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/usuario/trocar?antiga=' + this.state.currentpwdText + '&nova=' + this.state.newpwdText + '&token=' + this.state.token);
		request.send();
	}
}

const styles = StyleSheet.create({
	androidView: {
		paddingTop: -25
	},
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
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#33CCCC'
	}
})