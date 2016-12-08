import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Modal,
	Text,
	TextInput,
	ScrollView,
	Platform,
	StatusBar,
	AsyncStorage
} from 'react-native';
import TouchableElement from '../components/TouchableElement';
import dismissKeyboard from 'dismissKeyboard';
import Header from '../components/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingOverlay from '../components/LoadingOverlay';
import SuccessOverlay from '../components/SuccessOverlay';

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
			loadingIndex: -10,
			successIndex: -10
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.showSuccessOverlay = this.showSuccessOverlay.bind(this);
	}

	closeModal(){
		this.props.changeModalVisibility(false);
	}

	componentDidMount() {
		AsyncStorage.getItem('token', (err, result) => {
			this.setState({token: result});
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
		console.log(this.state.loadingIndex, ' zindex');

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
				<LoadingOverlay style={{zIndex: this.state.loadingIndex}}/>
				<SuccessOverlay style={{zIndex: this.state.successIndex}}/>
			</Modal>
		)
	}

	onSavePress() {
		this.setState({loadingIndex: 10});
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
				this.setState({loadingIndex: -10});
			}
		})
	}

	getTrocarSenha() {
		var request = new XMLHttpRequest();
		var _this = this;

		request.onreadystatechange = (e) => {

			if (request.readyState !== 4) {
				return;
			}

			_this.setState({loadingIndex: -10});
			if (request.status === 200) {
				// alert("Nova senha salva com sucesso!");
				_this.showSuccessOverlay();
			} else if (request.status === 404) {
				alert("Senha antiga incorreta.")
			} else {
				console.warn('Erro: não foi possível conectar ao servidor.');
			}
		};

		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/usuario/trocar?antiga=' + this.state.currentpwdText + '&nova=' + this.state.newpwdText + '&token=' + this.state.token);
		request.send();			
		
	}

	showSuccessOverlay() {
		this.setState({successIndex: 10})
		setTimeout(()=>{
			this.setState({successIndex: -10});
			this.closeModal();
		}, 1500);
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
})