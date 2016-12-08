import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	ListView,
	Platform,
	AsyncStorage
} from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import Placeholder from '../components/Placeholder';
import Filter from '../components/Filter';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import PropostasListItem from '../components/PropostasListItem';
import PropostaDetalheScene from './PropostaDetalheScene';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class PoliticoHistoricoPropostasScene extends Component {
	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
			selectedFilters: [],
			loading: true,
			listIsEmpty: false,
			errorState: false
		}
		this.onShowFilter = this.onShowFilter.bind(this);
		this.onCloseFilter = this.onCloseFilter.bind(this);
		this.onSubmitSearch = this.onSubmitSearch.bind(this);
		this.renderLoadingOrView = this.renderLoadingOrView.bind(this);
		this.getHistoricoPropostas = this.getHistoricoPropostas.bind(this);
		this.getCargoText = this.getCargoText.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	getHistoricoPropostas(token, filter) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = (e) => {
			if (request.readyState !== 4) {
				return;
			}

			if (request.status === 200) {
				const jsonResponse = JSON.parse(request.response);	
				if (Array.isArray(jsonResponse)) {
					this.setState({propostasDataSource: ds.cloneWithRows(jsonResponse), loading: false, listIsEmpty: (jsonResponse.length === 0) ? true : false});					
				} else {
					this.setState({errorState: true, loading: false});
				}
			} else {
				this.setState({errorState: true});
			}
		};

		const filterText = filter ? filter : '';
		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/politicos/' + this.props.politician_id + '/propostas?token=' + token + filterText);
		request.send();
	}

	componentDidMount() {
		AsyncStorage.getItem('token', (err, result) => {
			this.setState({token: result});
			this.getHistoricoPropostas(result);
		});
	}

	chooseFilterIcon() {
		return Platform.select({
			ios: 'md-funnel',
			android: 'md-options'
		})
	}

	getCargoText() {
		if (this.props.cargo) {
			return(<Text>{this.props.cargo}</Text>)
		} 
	}

	renderLoadingOrView() {
		if (this.state.loading) {
			return (<LoadingOverlay/>)
		} else if (this.state.listIsEmpty) {
			return (<Placeholder type='search' />)
		} else if (this.state.errorState) {
			return (<Placeholder type='error' onPress={() => {
				this.setState({errorState: false, loading: true}, this.getHistoricoPropostas(this.state.token))}} />)
		} else {
			let type = this.props.type ? this.props.type : 'lista';
			return (
				<ListView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.propostasDataSource} 
                    renderRow={(rowData) => <PropostasListItem onPress={()=>this.onPropostaPress(rowData)} proposta={rowData} cellType={'lista'}/>} />
			)
		}
	}

	render() {
		let filterIcon = this.chooseFilterIcon();
		const actions = [
		{
			title: 'Filtro',
			iconName: filterIcon,
			show: 'always',
			onActionSelected: this.onShowFilter
		}];

		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Histórico de Propostas'
					actions={actions} />
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
				<View style={{height: 3, borderBottomWidth: 1, borderColor: 'black'}}></View>
				{this.renderLoadingOrView()}
                <Filter 
                	navigator={this.props.navigator} 
                	modalVisible={this.state.modalVisible} 
                	changeFilterVisibility={this.changeFilterVisibility.bind(this)} 
                	type={'propostas'}
                	title='Filtrar Propostas'
                	onFilterActionSelected={(filter) => this.onFilterActionSelected(filter)} />
			</View>
		)
	}

	onShowFilter() {
		this.setState({modalVisible: true});
	}

	onCloseFilter() {
		this.setState({modalVisible: false});
	}

	changeFilterVisibility(visible) {
		this.setState({modalVisible: visible});
	}

	onSubmitSearch() {

	}

	onFilterActionSelected(filter) {
		console.log(filter);
		this.onCloseFilter();
		this.setState({errorState: false, listIsEmpty: false, loading: true}, this.getHistoricoPropostas(this.state.token, filter));
	}

	onPropostaPress(data) {
		this.props.navigator.push({component: PropostaDetalheScene, passProps: data});
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