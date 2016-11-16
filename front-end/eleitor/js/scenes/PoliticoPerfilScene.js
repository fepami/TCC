import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	ScrollView,
	Platform
} from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import ApprovalBar from '../components/ApprovalBar';
import PoliticoHistoricoPropostasScene from './PoliticoHistoricoPropostasScene';

export default class PoliticoPerfilScene extends Component {
	constructor(props){
		super(props);
		this.state = {
			politicoInfo: {},
			user_vote: 0,
			user_follow: false,
			loading: true
		}
		this.onStarActionSelected = this.onStarActionSelected.bind(this);
		this.onLikeActionSelected = this.onLikeActionSelected.bind(this);
		this.onDislikeActionSelected = this.onDislikeActionSelected.bind(this);
		this.getPolitico = this.getPolitico.bind(this);
		this.postVoto = this.postVoto.bind(this);
		this.postFollow = this.postFollow.bind(this);
		this.renderLoadingOrView = this.renderLoadingOrView.bind(this);
	}

	getPolitico() {
		var request = new XMLHttpRequest();
		request.onreadystatechange = (e) => {
			if (request.readyState !== 4) {
				return;
			}

			if (request.status === 200) {
				const jsonResponse = JSON.parse(request.response);
				this.setState({politicoInfo: jsonResponse[0], user_vote: jsonResponse[0].user_vote, user_follow: jsonResponse[0].user_follow, loading: false});
			} else {
				console.warn('Erro: não foi possível conectar ao servidor.');
			}
		};

		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/politicos/' + this.props.politician_id + '?device_id=device_id1');
		request.send();
	}

	postVoto(user_vote) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = (e) => {
			if (request.readyState !== 4) {
				return;
			}

			if (request.status === 200) {
				const jsonResponse = JSON.parse(request.response);
			} else {
				console.warn('Erro: não foi possível conectar ao servidor.');
			}
		};

		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/politicos/' + this.props.politician_id + '/votar?device_id=device_id1&user_vote=' + user_vote);
		request.send();
	}

	postFollow(user_follow) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = (e) => {
			if (request.readyState !== 4) {
				return;
			}

			if (request.status === 200) {
				const jsonResponse = JSON.parse(request.response);
			} else {
				console.warn('Erro: não foi possível conectar ao servidor.');
			}
		};

		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/politicos/' + this.props.politician_id + '/seguir?device_id=device_id1&user_follow=' + user_follow);
		request.send();
	}

	componentDidMount() {
		this.getPolitico();
	}

	onStarActionSelected(){
		if(this.state.user_follow === true){
			this.setState({user_follow: false}, this.postFollow(false));	
		} else {
			this.setState({user_follow: true}, this.postFollow(true));
		}
	}

	onLikeActionSelected(){
		if(this.state.user_vote === 1){
			this.setState({user_vote: 0}, this.postVoto(0));	
		} else {
			this.setState({user_vote: 1}, this.postVoto(1));
		}
	}

	onDislikeActionSelected(){
		if(this.state.user_vote === -1){
			this.setState({user_vote: 0}, this.postVoto(0));	
		} else {
			this.setState({user_vote: -1}, this.postVoto(-1));
		}
	}

	renderLoadingOrView() {
		if (this.state.loading) {
			return (<LoadingOverlay/>)
		} else {
			let like_bgcolor = (this.state.user_vote === 1) ? 'limegreen' : 'white';
			let likeIcon_color = (this.state.user_vote === 1) ? 'white' : 'limegreen';
			let dislike_bgcolor = (this.state.user_vote === -1) ? 'red' : 'white';
			let dislikeIcon_color = (this.state.user_vote === -1) ? 'white' : 'red';

			const approval_width = Dimensions.get('window').width - 30;
			
			return (
				<ScrollView style={{flex: 1}}>
					<View style={styles.view}>
						<View style={{alignItems: 'center'}}>
							<View style={{width: 120}}>
								<Image
									style={styles.roundedImage}
									source={{uri: this.state.politicoInfo.foto_url}} />
								<View style={styles.line}>
									<Text style={{color: 'black', fontWeight: 'bold'}}>{this.state.politicoInfo.n_p_votar}</Text>
								</View>
							</View>
						</View>
						<ApprovalBar viewSize={approval_width} approvalPercentage={this.state.politicoInfo.approval} />
						<Text style={styles.h1}>{this.state.politicoInfo.nome}, {this.state.politicoInfo.idade}</Text>
						<Text>{this.state.politicoInfo.cargo}</Text>
						<Text>{this.state.politicoInfo.vigencia}</Text>
						<Text>Partido: {this.state.politicoInfo.partido}</Text>
						<Text style={{paddingBottom: 15}}>email: {this.state.politicoInfo.email}</Text>
						<TouchableElement onPress={this.onPressHistorico.bind(this)}>
							<View style={styles.cellTop}>
								<Text style={styles.cellText}>Histórico de Propostas</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<TouchableElement onPress={this.onPressCarreira.bind(this)}>
							<View style={styles.cellBottom}>
								<Text style={styles.cellText}>Carreira Política</Text>
								{this.renderIcon()}
							</View>
						</TouchableElement>
						<View style={styles.box}>
							<TouchableElement onPress={this.onLikeActionSelected} style={[styles.like, {backgroundColor: like_bgcolor}]}>
								<Icon name='md-thumbs-up' color={likeIcon_color} size={30}/>
							</TouchableElement>
							<TouchableElement onPress={this.onDislikeActionSelected} style={[styles.dislike, {backgroundColor: dislike_bgcolor}]}>
								<Icon name='md-thumbs-down' color={dislikeIcon_color} size={30}/>
							</TouchableElement>
						</View>
					</View>
				</ScrollView>
			)
		}
	}

	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.arrowIcon}/>
		})
	}

	render(){
		const actions = [{
			title: 'Seguir',
			iconName: (this.state.user_follow === true) ? 'ios-star' : 'ios-star-outline',
			show: 'always',
			onActionSelected: this.onStarActionSelected
		}];

		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title={this.props.nome} 
					actions={actions}/>
				{this.renderLoadingOrView()}
			</View>
		)
	}

	onPressHistorico(){
		this.props.navigator.push({component: PoliticoHistoricoPropostasScene, passProps: this.props});
	}

	onPressCarreira(){
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
		fontWeight: 'bold'
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
		position: 'absolute',
		bottom: 0,
		width: 120,
		height: 25,
		borderTopColor: 'black',
		borderTopWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255,.5)'
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