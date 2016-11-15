import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	ScrollView,
	Platform
} from 'react-native';
import {connect} from 'react-redux';
import {switchTab} from '../redux/actions/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import LoginScene from './LoginScene';
import UsuarioEditarScene from '../scenes/UsuarioEditarScene';
import UsuarioTrocarSenhaScene from '../scenes/UsuarioTrocarSenhaScene';
import UsuarioPerfisAssociadosScene from '../scenes/UsuarioPerfisAssociadosScene';
import UsuarioAjudaScene from '../scenes/UsuarioAjudaScene';
import UsuarioProblemaScene from '../scenes/UsuarioProblemaScene';
import UsuarioSobreScene from '../scenes/UsuarioSobreScene';
import UsuarioTermosScene from '../scenes/UsuarioTermosScene';
import FBSDK from 'react-native-fbsdk';
const {
  LoginManager,
} = FBSDK;

class UsuarioConfiguracoesScene extends Component {
	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.arrowIcon}/>
		})
	}

	render() {
		return(
			<View style={{flex: 1}}>
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
								<Text>Deslogar</Text>
							</TouchableElement>
						</View>
					</View>
				</ScrollView>
			</View>
		)
	}

	onPressEditar() {
		const usuario = {nome: 'Marcela', email: 'marcela@gmail.com', idade: '24', sexo: 'Feminino', cidade: 'São Paulo', estado: 'SP'};
		this.props.navigator.push({component: UsuarioEditarScene, passProps: usuario});
	}

	onPressPassword() {
		this.props.navigator.push({component: UsuarioTrocarSenhaScene});
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
		// LoginManager.logout();
		// this.removeCredentials.bind(this);

		Platform.OS === 'ios' ? this.props.rootNavigator.resetTo({component: LoginScene}) : this.props.navigator.resetTo({component: LoginScene});
		this.props.dispatch(switchTab('home'));
	}

	removeCredentials() {
		AsyncStorage.removeItem('nome');
		AsyncStorage.removeItem('email');
		AsyncStorage.removeItem('sexo');
		AsyncStorage.removeItem('foto');
		AsyncStorage.removeItem('idade');
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
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default connect()(UsuarioConfiguracoesScene);