import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	ScrollView,
	Platform,
	AsyncStorage
} from 'react-native';
import {connect} from 'react-redux';
import {switchTab} from '../redux/actions/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import LoginScene from './LoginScene';
import UsuarioEditarScene from './UsuarioEditarScene';
import UsuarioTrocarSenhaScene from './UsuarioTrocarSenhaScene';
import UsuarioAjudaScene from './UsuarioAjudaScene';
import UsuarioProblemaScene from './UsuarioProblemaScene';
import UsuarioSobreScene from './UsuarioSobreScene';
import UsuarioTermosScene from './UsuarioTermosScene';
import FBSDK from 'react-native-fbsdk';
const {
  LoginManager,
} = FBSDK;

class UsuarioConfiguracoesScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nameText: 'Nome',
			emailText: 'Email',
			stateText: 'Estado',
			cityText: 'Cidade',
			ageText: 'Idade',
			genderText: '',
			pictureText: '',
			editSceneVisibility: false,
			passwordSceneVisibility: false
		}

		this.changePasswordSceneVisibility = this.changePasswordSceneVisibility.bind(this);
		this.changeEditSceneVisibility = this.changeEditSceneVisibility.bind(this);
	}

	componentDidMount() {
		AsyncStorage.getItem('name', (err, result) => {
			this.setState({nameText: result});
		});
		AsyncStorage.getItem('email', (err, result) => {
			this.setState({emailText: result});
		});
		AsyncStorage.getItem('state', (err, result) => {
			this.setState({stateText: result});
		});
		AsyncStorage.getItem('city', (err, result) => {
			this.setState({cityText: result});
		});
		AsyncStorage.getItem('age', (err, result) => {
			this.setState({ageText: result});
		});
		AsyncStorage.getItem('gender', (err, result) => {
			this.setState({genderText: result});
		});
		AsyncStorage.getItem('picture', (err, result) => {
			this.setState({pictureText: result});
		});
	}

	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.arrowIcon}/>
		})
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
						navigator={this.props.navigator}
						title='Configurações' />
				<ScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<TouchableElement onPress={this.onPressEditar.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Editar perfil</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressPassword.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Trocar a senha</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressAjuda.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Ajuda</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressProblema.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Reportar um problema</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressSobre.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Sobre o aplicativo</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressTermos.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Termos de uso</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<View style={styles.box}>
							<TouchableElement onPress={this.onPressDeslogar.bind(this)} style={styles.button}>
								<Text style={{fontWeight: 'bold', color: 'white'}}>Deslogar</Text>
							</TouchableElement>
						</View>
					</View>
				</ScrollView>
				<UsuarioEditarScene
					nameText={this.state.nameText}
					emailText={this.state.emailText}
					stateText={this.state.stateText}
					cityText={this.state.cityText}
					ageText={this.state.ageText}
					genderText={this.state.genderText}
					pictureText={this.state.pictureText}
					callback={this.props.callback}
					navigator={this.props.navigator} 
                	modalVisible={this.state.editSceneVisibility} 
                	changeModalVisibility={this.changeEditSceneVisibility} />
				<UsuarioTrocarSenhaScene 
					navigator={this.props.navigator} 
                	modalVisible={this.state.passwordSceneVisibility} 
                	changeModalVisibility={this.changePasswordSceneVisibility} />
			</View>
		)
	}

	onPressEditar() {
		this.changeEditSceneVisibility(true);
	}

	changeEditSceneVisibility(visibility) {
		this.setState({editSceneVisibility: visibility});
	}

	onPressPassword() {
		this.changePasswordSceneVisibility(true);
	}

	changePasswordSceneVisibility(visibility) {
		this.setState({passwordSceneVisibility: visibility});
	}

	onPressPerfis() {
		this.props.navigator.push({component: UsuarioPerfisAssociadosScene});
	}

	onPressAjuda() {
		this.props.navigator.push({component: UsuarioAjudaScene});
	}

	onPressProblema() {
		this.props.navigator.push({component: UsuarioProblemaScene});
	}

	onPressSobre() {
		this.props.navigator.push({component: UsuarioSobreScene});
	}

	onPressTermos() {
		this.props.navigator.push({component: UsuarioTermosScene});
	}

	onPressDeslogar() {
		LoginManager.logOut();
		this.removeCredentials.bind(this);

		Platform.OS === 'ios' ? this.props.rootNavigator.resetTo({component: LoginScene}) : this.props.navigator.resetTo({component: LoginScene});
		this.props.dispatch(switchTab('home'));
	}

	removeCredentials() {
		AsyncStorage.multiRemove(['name', 'email', 'state', 'city', 'age', 'gender', 'picture', 'token']);
	}
}

const styles = StyleSheet.create({
	view: {
		paddingHorizontal: 15,
		flexDirection: 'column',
		flex: 1
	},
	cellBottom: {
		paddingVertical: 15,
		flexDirection: 'row', 
		borderBottomColor: 'rgba(0,0,0,.87)',
		borderBottomWidth: 1
	},
	cellText: {
		flex: 1, 
		alignSelf: 'center'
	},
	arrowIcon: {
		alignSelf: 'center'
	},
	box: {
		flex: 1,
		height: 100,
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

export default connect()(UsuarioConfiguracoesScene);