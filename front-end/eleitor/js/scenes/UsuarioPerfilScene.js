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
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import UsuarioConfiguracoesScene from './UsuarioConfiguracoesScene';
import UsuarioEditarScene from './UsuarioEditarScene';

export default class UsuarioPerfilScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: 'Nome',
			email: 'Email',
			state: 'Estado',
			city: 'Cidade',
			age: 'Idade',
			picture: '',
			editSceneVisibility: false
		}
		this.changeEditSceneVisibility = this.changeEditSceneVisibility.bind(this);
	}

	componentDidMount() {
		var _this = this;
		AsyncStorage.getItem('name', (err, result) => {
			_this.setState({name: result});
		});
		AsyncStorage.getItem('email', (err, result) => {
			_this.setState({email: result});
		});
		AsyncStorage.getItem('state', (err, result) => {
			_this.setState({state: result});
		});
		AsyncStorage.getItem('city', (err, result) => {
			_this.setState({city: result});
		});
		AsyncStorage.getItem('age', (err, result) => {
			_this.setState({age: result});
		});
		AsyncStorage.getItem('picture', (err, result) => {
			_this.setState({picture: result});
		});
	}

	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.arrowIcon} color='black'/>
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
								source={this.state.picture ? {uri: this.state.picture} : require('../resources/image/placeholder.png')} />
							<Text style={styles.h1}>{this.state.name}, {this.state.age} anos</Text>
							<Text >{this.state.email}</Text>
							<Text >Vota em: {this.state.city}, {this.state.state}</Text>
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
				<UsuarioEditarScene 
					navigator={this.props.navigator} 
                	modalVisible={this.state.editSceneVisibility} 
                	changeModalVisibility={this.changeEditSceneVisibility} />
			</View>
		)
	}

	onPressConfiguracoes(){
		this.props.navigator.push({component: UsuarioConfiguracoesScene});
	}

	onPressEditar() {
		this.changeEditSceneVisibility(true);
	}

	changeEditSceneVisibility(visibility) {
		this.setState({editSceneVisibility: visibility});
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
		paddingTop: 15,
	},
	roundedImage: {
		width: 100, 
		height: 100, 
		borderRadius: 50,
		alignSelf: 'center',
		borderColor: 'black',
		borderWidth: 2
	},
	line: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 15
	},
	cellTop: {
		paddingVertical: 15,
		flexDirection: 'row', 
		borderTopColor: 'black',
		borderTopWidth: 1,
		borderBottomColor: 'black',
		borderBottomWidth: 1
	},
	cellBottom: {
		paddingVertical: 15,
		flexDirection: 'row', 
		borderBottomColor: 'black',
		borderBottomWidth: 1
	},
	cellText: {
		flex: 1, 
		alignSelf: 'center',
		color: 'black'
	},
	arrowIcon: {
		alignSelf: 'center'
	}
})