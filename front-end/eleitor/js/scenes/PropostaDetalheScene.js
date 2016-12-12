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
import LoadingOverlay from '../components/LoadingOverlay';
import Gradient from '../components/Gradient';
import Placeholder from '../components/Placeholder';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableElement from '../components/TouchableElement';
import Header from '../components/Header';
import ApprovalBar from '../components/ApprovalBar';
import PoliticosListItem from '../components/PoliticosListItem';
import PoliticoPerfilScene from './PoliticoPerfilScene';
import ApiCall from '../api/ApiCall';
import {connect} from 'react-redux';

class PropostaDetalheScene extends Component {
	constructor(props){
		super(props);
		this.state = {
			propostaInfo: {},
			user_vote: 0,
			loading: true,
			errorState: false
		}
		this.onLikeActionSelected = this.onLikeActionSelected.bind(this);
		this.onDislikeActionSelected = this.onDislikeActionSelected.bind(this);
		this.getPoliticos = this.getPoliticos.bind(this);
		this.postVoto = this.postVoto.bind(this);
		this.getProposta = this.getProposta.bind(this);
		this.renderLoadingOrView = this.renderLoadingOrView.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	getProposta() {
		var options = {token: this.props.token};
		ApiCall(`propostas/${this.props.proposal_id}`, options, (jsonResponse) => {
			this.setState({propostaInfo: jsonResponse[0], approval: jsonResponse[0].approval, user_vote: jsonResponse[0].user_vote, loading: false});
		}, (failedRequest) => {
			this.setState({errorState: true});
		});
	}

	postVoto(user_vote) {
		var options = {
			token: this.props.token,
			user_vote
		};
		ApiCall(`propostas/${this.props.proposal_id}/votar`, options, (jsonResponse) => {
			this.setState({approval: jsonResponse[0].approval});
		}, (failedRequest) => {
			alert('Erro: não foi possível conectar ao servidor.');
		});
	}

	componentDidMount() {
		this.getProposta();
	}

	renderIcon() {
		return Platform.select({
			ios: <Icon name='ios-arrow-forward' size={24} style={styles.arrowIcon}/>
		})
	}

	getPoliticos() {
		return this.state.propostaInfo.politicos.map((politicoData, ii) => (
			<TouchableElement onPress={() => this.onPoliticoPress(politicoData)} key={politicoData.politician_id.toString()}>
				<View style={styles.cell}>
					<Image
						style={styles.roundedimage}
						source={{uri: politicoData.foto_url}} />
					<Text style={styles.h2}>{politicoData.nome}</Text>
					{this.renderIcon()}
				</View>
			</TouchableElement>
		));
	}

	renderLoadingOrView() {
		if (this.state.loading) {
			return (<LoadingOverlay/>)
		} else if (this.state.errorState) {
			return (<Placeholder type='error' onPress={() => {
				this.setState({errorState: false, loading: true}, this.getProposta())}} />)
		} else {
			let like_bgcolor = (this.state.user_vote === 1) ? 'limegreen' : 'white';
			let likeIcon_color = (this.state.user_vote === 1) ? 'white' : 'limegreen';
			let dislike_bgcolor = (this.state.user_vote === -1) ? 'red' : 'white';
			let dislikeIcon_color = (this.state.user_vote === -1) ? 'white' : 'red';

			const approval_width = Dimensions.get('window').width - 30;

			return (
				<View style={{flex: 1}}>
					<ScrollView style={{flex: 1}}>
						<View style={styles.view}>
							<Text style={styles.h1}>{this.state.propostaInfo.nome}</Text>
							<Text>Código: {this.state.propostaInfo.codigo}</Text>
							<Text>Categoria: {this.state.propostaInfo.categoria}</Text>
							<Text>Proposta em: {this.state.propostaInfo.data}</Text>
							<ApprovalBar viewSize={approval_width} approvalPercentage={this.state.approval} />
							<Text style={{fontWeight: 'bold', paddingBottom: 15}}>Políticos responsáveis:</Text>
							{this.getPoliticos()}
							<Text style={{fontWeight: 'bold', paddingTop: 15}}>Descrição:</Text>
							<Text>{this.state.propostaInfo.descricao}</Text>
						</View>
					</ScrollView>
					<Gradient />
					<View style={styles.box}>
						<TouchableElement onPress={this.onLikeActionSelected} style={[styles.like, {backgroundColor: like_bgcolor}]}>
							<Icon name='md-thumbs-up' color={likeIcon_color} size={30}/>
						</TouchableElement>
						<TouchableElement onPress={this.onDislikeActionSelected} style={[styles.dislike, {backgroundColor: dislike_bgcolor}]}>
							<Icon name='md-thumbs-down' color={dislikeIcon_color} size={30}/>
						</TouchableElement>
					</View>
				</View>
			)
		}
	}

	render(){
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title={this.state.propostaInfo.codigo} />
				{this.renderLoadingOrView()}
			</View>
		)
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

	onPoliticoPress(data){
		this.props.navigator.push({component: PoliticoPerfilScene, passProps: data});
	}
}

function mapStateToProps(store) {
	return {
		token: store.token.token
	}
}

export default connect(mapStateToProps)(PropostaDetalheScene);

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
	arrowIcon: {
		alignSelf: 'center'
	},
	cell: {
		borderTopWidth:1,
		borderBottomWidth: 1,
		borderColor: 'black',
		paddingHorizontal: 0,
		paddingVertical: 10,
		flexDirection: 'row'
	},
	h2: {
		flex: 1,
		fontWeight: 'bold',
		paddingHorizontal: 15,
		alignSelf: 'center'
	},
	roundedimage: {
		width: 50, 
		height: 50, 
		borderRadius: 25,
		borderColor: 'black',
		borderWidth: 1,
		alignSelf: 'center'
	},
	box: {
		height: 70,
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