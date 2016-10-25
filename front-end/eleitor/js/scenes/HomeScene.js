import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import ListaPoliticosScene from '../scenes/ListaPoliticosScene';

export default class HomeScene extends Component {
	constructor(props){
		super(props);
		this.onPressRankingPoliticos = this.onPressRankingPoliticos.bind(this);
	}

	render(){
		console.log(this.props);
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Home' />
				<View style={styles.view}>
					<TouchableElement style={styles.banner}  onPress={this.onPress}>
						<Text>Confira os candidatos da próxima eleição</Text>
					</TouchableElement>
					<TouchableElement style={styles.banner}  onPress={this.onPress}>
						<Text>Propostas mais recentes</Text>
					</TouchableElement>
					<TouchableElement style={styles.banner}  onPress={this.onPressRankingPoliticos}>
						<Text>Ranking de políticos</Text>
					</TouchableElement>
					<TouchableElement style={styles.banner}  onPress={this.onPress}>
						<Text>Ranking de propostas</Text>
					</TouchableElement>
				</View>
			</View>
		)
	}

	onPress(data){
		// console.log(data);
		// this.props.navigator.push({component: PoliticoPerfilScene, passProps: {nome: data.nome}});
	}

	onPressRankingPoliticos(data){
		// console.log(data);
		this.props.navigator.push({component: ListaPoliticosScene, passProps: {type: 'ranking'}});
	}
}

const styles = StyleSheet.create({
	view: {
		padding: 15,
		flexDirection: 'column',
		flex: 1
	},
	banner: {
		height: 50,
		marginVertical: 10,
		borderColor: 'black',
		borderWidth: StyleSheet.hairlineWidth,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	}
})