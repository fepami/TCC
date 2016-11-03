import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	Platform
} from 'react-native';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import ApprovalBar from '../components/ApprovalBar';
import PoliticosListItem from '../components/PoliticosListItem';
import PoliticoPerfilScene from '../scenes/PoliticoPerfilScene';
import {fakePolitico0, fakePolitico1, fakePolitico2} from '../fakeData';

export default class PropostaDetalheScene extends Component {
	constructor(props){
		super(props);
		this.state = {
			likeIcon: 'ios-thumbs-up',
			dislikeIcon: 'ios-thumbs-down'
		}
		this.onLikeActionSelected = this.onLikeActionSelected.bind(this);
		this.onDislikeActionSelected = this.onDislikeActionSelected.bind(this);
	}

	onLikeActionSelected(){
		if(this.state.likeIcon === 'ios-thumbs-up-outline'){
			this.setState({likeIcon: 'ios-thumbs-up'});	
		} else {
			this.setState({likeIcon: 'ios-thumbs-up-outline'});
			this.setState({dislikeIcon: 'ios-thumbs-down'});
		}
	}

	onDislikeActionSelected(){
		if(this.state.dislikeIcon === 'ios-thumbs-down-outline'){
			this.setState({dislikeIcon: 'ios-thumbs-down'});	
		} else {
			this.setState({dislikeIcon: 'ios-thumbs-down-outline'});
			this.setState({likeIcon: 'ios-thumbs-up'});	
		}
	}

	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.arrowIcon}/>
		})
	}

	getPoliticoByID(id) {
		switch(id) {
			case 0:
				return fakePolitico0;
			case 1:
				return fakePolitico1;
			case 2:
				return fakePolitico2;
			default:
				return fakePolitico0;
				break;
		}
	}

	render(){
		let like_bgcolor = (this.state.likeIcon === 'ios-thumbs-up-outline') ? 'limegreen' : 'white';
		let likeIcon_color = (this.state.likeIcon === 'ios-thumbs-up-outline') ? 'white' : 'limegreen';
		let dislike_bgcolor = (this.state.dislikeIcon === 'ios-thumbs-down-outline') ? 'red' : 'white';
		let dislikeIcon_color = (this.state.dislikeIcon === 'ios-thumbs-down-outline') ? 'white' : 'red';

		const approval_width = Dimensions.get('window').width - 30;
		const politicoData = this.getPoliticoByID(this.props.politicoID);
		
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title={this.props.categoria} />
				<View style={styles.view}>
					<Text style={styles.h1}>{this.props.nome}</Text>
					<Text>Categoria: {this.props.categoria}</Text>
					<Text>Proposta em: {this.props.data}</Text>
					<Text>Por: {this.props.nomePolitico}</Text>
					<ApprovalBar viewSize={approval_width} approvalPercentage={this.props.approval} />
					<Text>Descrição:</Text>
					<Text style={{paddingBottom: 15}}>{this.props.descricao}</Text>
					<PoliticosListItem style={styles.cell} onPress={()=>this.onPoliticoPress(politicoData)} politico={politicoData} cellType='lista'/>
					<View style={styles.box}>
						<TouchableElement onPress={this.onLikeActionSelected} style={[styles.like, {backgroundColor: like_bgcolor}]}>
							<Icon name='md-thumbs-up' color={likeIcon_color} size={30}/>
						</TouchableElement>
						<TouchableElement onPress={this.onDislikeActionSelected} style={[styles.dislike, {backgroundColor: dislike_bgcolor}]}>
							<Icon name='md-thumbs-down' color={dislikeIcon_color} size={30}/>
						</TouchableElement>
					</View>
				</View>
			</View>
		)
	}

	onPoliticoPress(data){
		// console.log(data);
		this.props.navigator.push({component: PoliticoPerfilScene, passProps: data});
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
		fontWeight: 'bold'
	},
	cell: {
		paddingHorizontal: 0,
		borderTopWidth:1,
		borderBottomWidth: 1,
		borderColor: 'black'
	},
	arrowIcon: {
		alignSelf: 'center'
	},
	box: {
		height: 100,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	like: {
		width: 100,
		height: 40,
		margin: 15,
		borderColor: 'limegreen',
		borderWidth: 1,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	},
	dislike: {
		width: 100,
		height: 40,
		margin: 15,
		borderColor: 'red',
		borderWidth: 1,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	}
})