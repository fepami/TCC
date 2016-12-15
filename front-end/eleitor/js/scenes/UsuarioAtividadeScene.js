import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	ScrollView,
	Text,
	Platform,
	AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import LoadingOverlay from '../components/LoadingOverlay';
import ApiCall from '../api/ApiCall';
import {connect} from 'react-redux';

class UsuarioAtividadeScene extends Component {
	constructor(props){
		super(props);
		this.state = {
			arrayAtividades: [],
			loading: true,
			errorState: false
		}
		
		this.getAtividade = this.getAtividade.bind(this);
		this.renderLoadingOrView = this.renderLoadingOrView.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	getAtividade() {
		var options = {token: this.props.token};
		ApiCall(`usuario/atividades`, options, (jsonResponse) => {
			this.setState({arrayAtividades: jsonResponse.reverse(), loading: false});
		}, (failedRequest) => {
			this.setState({errorState: true});
		});
	}

	componentDidMount() {
		this.getAtividade();
	}

	renderLoadingOrView() {
		if (this.state.loading) {
			return (<LoadingOverlay/>)
		} else if (this.state.errorState) {
			return (<Placeholder type='error' onPress={() => {
				this.setState({errorState: false, loading: true}, this.getAtividade())}} />)
		} else {
			return this.state.arrayAtividades.map((item, ii) => (
				<View  key={ii} style={{borderBottomWidth: 1, borderColor: 'black', paddingVertical: 10}}>
					<Text style={styles.h1}>{item.data}:</Text>
					<View style={{flexDirection: 'row'}}>
						<Icon 
							name={item.tipo === 'vote' ? item.valor === 1 ? 'md-thumbs-up' : item.valor === -1 ? 'md-thumbs-down' : 'ios-qr-scanner' : item.valor === 1 ? 'ios-star' : 'ios-star-outline'} 
							color={item.tipo === 'vote' ? item.valor === 1 ? 'limegreen' : item.valor === -1 ? 'red' : 'black' : 'black'} 
							size={24} 
							style={{alignSelf: 'center', marginRight: 10}} />
						<View style={{flex: 1, alignSelf: 'center'}}>
							<Text>{item.descricao}</Text>
						</View>
					</View>
				</View>
			));
		}
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Atividades Recentes' />
				<View style={styles.cell}>
					<Image
						style={styles.roundedimage}
						source={this.props.foto_url ? {uri: this.props.foto_url} : require('../resources/image/placeholder.png')} />
					<View style={styles.info}>
						<Text style={styles.h1}>{this.props.nome}</Text>
						<Text>{this.props.email}</Text>
					</View>
				</View>
				<View style={{flex: 1, marginTop: 3, borderTopWidth: 1, borderColor: 'black'}}>
					<ScrollView style={{flex: 1}}>
						<View style={{flex: 1, paddingTop: 5, paddingHorizontal: 15}}>
							{this.renderLoadingOrView()}
						</View>
					</ScrollView>
				</View>
			</View>
		)
	}
}

function mapStateToProps(store) {
	return {
		token: store.token.token
	}
}

export default connect(mapStateToProps)(UsuarioAtividadeScene);

const styles = StyleSheet.create({
	cell: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: 'black'
	},
	h1: {
		fontWeight: 'bold'
	},
	roundedimage: {
		width: 50, 
		height: 50, 
		borderRadius: 25,
		borderColor: 'black',
		borderWidth: 1,
		alignSelf: 'center'
	},
	info: {
		flexDirection: 'column', 
		flex: 1, 
		paddingHorizontal: 15,
		justifyContent: 'center'
	},
	icon: {
		alignSelf: 'center'
	},
	ranking: {
		width: 20,
		color: 'black', 
		paddingRight: 15, 
		alignSelf: 'center'
	}
})