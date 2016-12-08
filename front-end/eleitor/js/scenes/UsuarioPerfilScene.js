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
			nameText: 'Nome',
			emailText: 'Email',
			stateText: 'Estado',
			cityText: 'Cidade',
			ageText: 'Idade',
			genderText: '',
			pictureText: '',
			editSceneVisibility: false
		}
		this.changeEditSceneVisibility = this.changeEditSceneVisibility.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.refresh = this.refresh.bind(this);
	}

	componentDidMount() {
		this.refresh();
		this.props.navigator.refresh = this.refresh;
	}

	refresh() {
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

		const imageSource = (this.state.pictureText) && (this.state.pictureText != '') && (this.state.pictureText != 'null') ? {uri: this.state.pictureText} : require('../resources/image/placeholder.png');
		
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
							<View style={styles.roundedView}>
								<Image
									style={styles.roundedImage}
									source={imageSource}/>
							</View>
							<Text style={styles.h1}>{this.state.nameText}, {this.state.ageText} anos</Text>
							<Text >{this.state.emailText}</Text>
							<Text >Vota em: {this.state.cityText}, {this.state.stateText}</Text>
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
					nameText={this.state.nameText}
					emailText={this.state.emailText}
					stateText={this.state.stateText}
					cityText={this.state.cityText}
					ageText={this.state.ageText}
					genderText={this.state.genderText}
					pictureText={this.state.pictureText}
					callback={this.refresh}
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