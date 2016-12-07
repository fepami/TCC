import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	Platform,
	AsyncStorage
} from 'react-native';
import Header from '../components/Header';
import LoadingOverlay from '../components/LoadingOverlay';

export default class PoliticoCarreiraScene extends Component {
	constructor(props){
		super(props);
		this.state = {
			carreiraInfo: [],
			loading: true,
			errorState: false
		}
		
		this.getCarreira = this.getCarreira.bind(this);
		this.getCargoText = this.getCargoText.bind(this);
		this.renderLoadingOrView = this.renderLoadingOrView.bind(this);

	}

	getCarreira(token) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = (e) => {
			if (request.readyState !== 4) {
				return;
			}

			if (request.status === 200) {
				const jsonResponse = JSON.parse(request.response);
				this.setState({carreiraInfo: jsonResponse, loading: false});
			} else {
				this.setState({errorState: true});
			}
		};

		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/politicos/' + this.props.politician_id + '/carreira?token=' + token);
		request.send();
	}

	componentDidMount() {
		var _this = this;
		AsyncStorage.getItem('token', (err, result) => {
			_this.setState({token: result});
			_this.getCarreira(result);
		});
	}

	getCargoText() {
		if (this.props.cargo) {
			return(<Text>{this.props.cargo}</Text>)
		} 
	}

	renderLoadingOrView() {
		if (this.state.loading) {
			return (<LoadingOverlay/>)
		} else if (this.state.errorState) {
			return (<Placeholder type='error' onPress={() => {
				this.setState({errorState: false, loading: true}, this.getCarreira(this.state.token))}} />)
		} else {
			return this.state.carreiraInfo.map((item, ii) => (
				<Text key={ii}>● {item}</Text>
			));
		}
	}

	render() {
		return(
			<View style={{flex: 1}}>
				<Header
					navigator={this.props.navigator}
					title='Carreira Politica' />
				<View style={styles.cell}>
					<Image
						style={styles.roundedimage}
						source={{uri: this.props.foto_url}} />
					<View style={styles.info}>
						<Text style={styles.h1}>{this.props.nome}</Text>
						{this.getCargoText()}
						<Text>{this.props.partido}</Text>
					</View>
				</View>
				<View style={{marginTop: 3, borderTopWidth: 1, borderColor: 'black', paddingTop: 15, paddingHorizontal: 15}}>
					{this.renderLoadingOrView()}
				</View>
			</View>
		)
	}
}

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