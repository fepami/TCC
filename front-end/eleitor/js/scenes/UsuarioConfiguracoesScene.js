import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	ScrollView,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import UsuarioEditarScene from '../scenes/UsuarioEditarScene';
import UsuarioTrocarSenhaScene from '../scenes/UsuarioTrocarSenhaScene';
import UsuarioPerfisAssociadosScene from '../scenes/UsuarioPerfisAssociadosScene';
import UsuarioAjudaScene from '../scenes/UsuarioAjudaScene';
import UsuarioProblemaScene from '../scenes/UsuarioProblemaScene';
import UsuarioSobreScene from '../scenes/UsuarioSobreScene';
import UsuarioTermosScene from '../scenes/UsuarioTermosScene';

export default class UsuarioConfiguracoesScene extends Component {
	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.arrowIcon}/>
		})
	}

	render() {
		return(
			<View>
				<Header
						navigator={this.props.navigator}
						title='Configurações' />
				<ScrollView  style={styles.view}>
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
					<TouchableElement onPress={this.onPressPerfis.bind(this)}>
						<View style={styles.cellBottom}>
							<Text style={styles.cellText}>Perfis associados</Text>
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
				</ScrollView>
			</View>
		)
	}

	onPressEditar() {
		this.props.navigator.push({component: UsuarioEditarScene});
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