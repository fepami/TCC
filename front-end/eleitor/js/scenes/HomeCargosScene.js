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
import HomeCargosExplicacaoScene from './HomeCargosExplicacaoScene';

export default class HomeCargosScene extends Component {
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
						title='Entenda os Cargos' />
				<ScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<View style={styles.title}>
							<Text style={{fontWeight: 'bold', color: 'white'}}>Poder Executivo</Text>
						</View>
						<TouchableElement onPress={this.onPressPresidente.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Presidente</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressGovernador.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Governador</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressPrefeito.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Prefeito</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<View style={styles.title}>
							<Text style={{fontWeight: 'bold', color: 'white'}}>Poder Legislativo</Text>
						</View>
						<TouchableElement onPress={this.onPressDeputado.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Deputados</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressSenador.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Senadores</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressVereador.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Vereadores</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<View style={styles.title}>
							<Text style={{fontWeight: 'bold', color: 'white'}}>Poder Judiciário - Cargos não eletivos</Text>
						</View>
						<TouchableElement onPress={this.onPressMinistro.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Juízes, Desembargadores e Ministros</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
					</View>
				</ScrollView>
			</View>
		)
	}

	onPressPresidente() {
		this.props.navigator.push({component: HomeCargosExplicacaoScene, passProps:{title: 'Presidente'}});
	}

	onPressGovernador() {
		this.props.navigator.push({component: HomeCargosExplicacaoScene, passProps:{title: 'Governador'}});
	}

	onPressPrefeito() {
		this.props.navigator.push({component: HomeCargosExplicacaoScene, passProps:{title: 'Prefeito'}});
	}

	onPressDeputado() {
		this.props.navigator.push({component: HomeCargosExplicacaoScene, passProps:{title: 'Deputados'}});
	}

	onPressSenador() {
		this.props.navigator.push({component: HomeCargosExplicacaoScene, passProps:{title: 'Senadores'}});
	}

	onPressVereador() {
		this.props.navigator.push({component: HomeCargosExplicacaoScene, passProps:{title: 'Vereadores'}});
	}

	onPressMinistro() {
		this.props.navigator.push({component: HomeCargosExplicacaoScene, passProps:{title: 'Poder Judiciário'}});
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
		// borderBottomColor: 'rgba(0,0,0,.87)',
		// borderBottomWidth: 1
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
	title: {
		flex: 1,
		paddingVertical: 5,
		paddingHorizontal: 15,
		marginHorizontal: -15,
		backgroundColor: '#575757'
	}
})