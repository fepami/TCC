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
import UsuarioConfiguracoesScene from '../scenes/UsuarioConfiguracoesScene';
import UsuarioEditarScene from '../scenes/UsuarioEditarScene';

export default class UsuarioPerfilScene extends Component {
	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.arrowIcon}/>
		})
	}

	render(){
		const rightActions = [{
			title: 'Editar',
			iconName: 'md-create',
			show: 'always',
			onActionSelected: this.onPressEditar.bind(this)
		},
		{
			title: 'Configurações',
			iconName: 'md-settings',
			show: 'always',
			onActionSelected: this.onPressConfiguracoes.bind(this)
		}];

		const leftActions = Platform.select({
			ios: {
				icon: 'md-settings',
				onPress: this.onPressConfiguracoes.bind(this)
		}});

		const usuario = {nome: 'NOME DO USUARIO', idade: 'IDADE', email: 'EMAIL@GMAIL.COM', cidade: 'CIDADE', estado: 'ESTADO', sexo: 'FEM/MASC'};

		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Perfil'
					actions={rightActions}
					leftItem={leftActions} />
				<ScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<View style={styles.line}>
							<Image
								style={styles.roundedImage}
								source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}} />
							<Text style={styles.h1}>{usuario.nome}, {usuario.idade}</Text>
							<Text>{usuario.email}</Text>
							<Text>Vota em: {usuario.cidade}, {usuario.estado}</Text>
							<Text>{usuario.sexo}</Text>
						</View>
						<TouchableElement onPress={this.onPressConfiguracoes.bind(this)}>
							<View style={styles.cellTop}>
								<Text style={styles.cellText}>Configurações</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressAtividades.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Atividades Recentes</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
					</View>
				</ScrollView>
			</View>
		)
	}

	onPressConfiguracoes(){
		this.props.navigator.push({component: UsuarioConfiguracoesScene});
	}

	onPressEditar(){
		const usuario = {nome: 'Marcela', email: 'marcela@gmail.com', idade: '24', sexo: 'Feminino', cidade: 'São Paulo', estado: 'SP'};
		this.props.navigator.push({component: UsuarioEditarScene, passProps: usuario});
	}

	onPressAtividades(){
		// this.props.navigator.push({component: PoliticoPerfilScene, passProps: {nome: data.nome}});
	}
}

const styles = StyleSheet.create({
	view: {
		padding: 15,
		flexDirection: 'column',
		flex: 1
	},
	h1: {
		fontSize: 16,
		fontWeight: 'bold',
		paddingTop: 15
	},
	roundedImage: {
		width: 100, 
		height: 100, 
		borderRadius: 50,
		alignSelf: 'center',
		borderColor: 'black',
		borderWidth: 1
	},
	line: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 15
	},
	cellTop: {
		paddingVertical: 15,
		flexDirection: 'row', 
		borderTopColor: 'rgba(0,0,0,.87)',
		borderTopWidth: 1,
		borderBottomColor: 'rgba(0,0,0,.87)',
		borderBottomWidth: 1
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
	}
})