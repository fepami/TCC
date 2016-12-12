import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	Text,
	Image,
	Platform
} from 'react-native';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import ListaPoliticosScene from './ListaPoliticosScene';
import ListaPropostasScene from './ListaPropostasScene';
import HomeCargosScene from './HomeCargosScene';
import Dimensions from 'Dimensions';

export default class HomeScene extends Component {
	constructor(props){
		super(props);
		this.onPressEleicao = this.onPressEleicao.bind(this);
		this.onPressCargos = this.onPressCargos.bind(this);
		this.onPressRankingPoliticos = this.onPressRankingPoliticos.bind(this);
		this.onPressRankingPropostas = this.onPressRankingPropostas.bind(this);
	}

	render(){
		const width = Dimensions.get('window').width;
		const height = width/784.0*295;
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Home' />
				<ScrollView style={{flex: 1}}>
					<View style={[styles.view, {marginTop: (Platform.select({ios: -20}))}]}>
						<TouchableElement style={{marginBottom: 5}} onPress={this.onPressEleicao}>
							<Image
							style={[styles.banner, {width: width, height: height}]}
							source={require('../resources/image/banner1.png')} />
						</TouchableElement>
						<TouchableElement style={{marginBottom: 5}} onPress={this.onPressCargos}>
							<Image
							style={[styles.banner, {width: width, height: height}]}
							source={require('../resources/image/banner2.png')} />
						</TouchableElement>
						<TouchableElement style={{marginBottom: 5}} onPress={this.onPressRankingPoliticos}>
							<Image
							style={[styles.banner, {width: width, height: height}]}
							source={require('../resources/image/banner3.png')} />
						</TouchableElement>
						<TouchableElement onPress={this.onPressRankingPropostas}>
							<Image
							style={[styles.banner, {width: width, height: height}]}
							source={require('../resources/image/banner4.png')} />
						</TouchableElement>
					</View>
				</ScrollView>
			</View>
		)
	}

	onPressEleicao(){
		this.props.navigator.push({component: ListaPoliticosScene, passProps: {type: 'eleicoes'}});
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
		flex: 1,
	},
	banner: {
		resizeMode: 'contain',
	}
})