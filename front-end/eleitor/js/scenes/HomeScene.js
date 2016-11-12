import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	Text
} from 'react-native';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import ListaPoliticosScene from '../scenes/ListaPoliticosScene';
import ListaPropostasScene from '../scenes/ListaPropostasScene';
import HomeCargosScene from '../scenes/HomeCargosScene';

export default class HomeScene extends Component {
	constructor(props){
		super(props);
		this.onPressEleicao = this.onPressEleicao.bind(this);
		this.onPressCargos = this.onPressCargos.bind(this);
		this.onPressRankingPoliticos = this.onPressRankingPoliticos.bind(this);
		this.onPressRankingPropostas = this.onPressRankingPropostas.bind(this);
	}

	render(){
		console.log(this.props);
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Home' />
				<ScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<TouchableElement style={styles.banner}  onPress={this.onPressEleicao}>
							<Text>Confira os candidatos da próxima eleição</Text>
						</TouchableElement>
						<TouchableElement style={styles.banner}  onPress={this.onPressCargos}>
							<Text>Entenda o que faz cada cargo político</Text>
						</TouchableElement>
						<TouchableElement style={styles.banner}  onPress={this.onPressRankingPoliticos}>
							<Text>Ranking de políticos</Text>
						</TouchableElement>
						<TouchableElement style={styles.banner}  onPress={this.onPressRankingPropostas}>
							<Text>Ranking de propostas</Text>
						</TouchableElement>
					</View>
				</ScrollView>
			</View>
		)
	}

	onPressEleicao(){
		// this.props.navigator.push({component: PoliticoPerfilScene, passProps: {nome: data.nome}});
	}

	onPressCargos(){
		this.props.navigator.push({component: HomeCargosScene});
	}

	onPressRankingPoliticos(){
		this.props.navigator.push({component: ListaPoliticosScene, passProps: {type: 'ranking'}});
	}

	onPressRankingPropostas(){
		this.props.navigator.push({component: ListaPropostasScene, passProps: {type: 'ranking'}});
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