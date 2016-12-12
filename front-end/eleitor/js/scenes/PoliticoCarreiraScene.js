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
import ApiCall from '../api/ApiCall';
import {connect} from 'react-redux';

class PoliticoCarreiraScene extends Component {
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
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	getCarreira() {
		var options = {token: this.props.token};
		ApiCall(`politicos/${this.props.politician_id}/carreira`, options, (jsonResponse) => {
			this.setState({carreiraInfo: jsonResponse, loading: false});
		}, (failedRequest) => {
			this.setState({errorState: true});
		});
	}

	componentDidMount() {
		this.getCarreira();
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
				this.setState({errorState: false, loading: true}, this.getCarreira())}} />)
		} else {
			return this.state.carreiraInfo.map((item, ii) => (
				<Text key={ii}>● {item}</Text>
			));
		}
	}

	render() {
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
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

function mapStateToProps(store) {
	return {
		token: store.token.token
	}
}

export default connect(mapStateToProps)(PoliticoCarreiraScene);

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