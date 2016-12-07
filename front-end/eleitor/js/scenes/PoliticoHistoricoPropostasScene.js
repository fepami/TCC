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
	}

	getHistoricoPropostas(token) {
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

		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/politicos/' + this.props.politician_id + '/propostas?token=' + token);
		request.send();
	}

	componentDidMount() {
		var _this = this;
		AsyncStorage.getItem('token', (err, result) => {
			_this.setState({token: result});
			_this.getHistoricoPropostas(result);
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
			<View style={{flex: 1}}>
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
                	dtype={'propostas'}
                	title='Filtrar Propostas'
                	selectedFilters={this.state.selectedFilters}
                	onSelectFilter={(option) => this.onSelectFilter(option)} 
                	onClearActionSelected={() => this.onClearActionSelected()}
                	onFilterActionSelected={() => this.onFilterActionSelected()} />
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

	onSelectFilter(option) {
		console.log(option);
		let newSelectedOptions = this.state.selectedFilters;
		if (newSelectedOptions.includes(option)) {
			let index = newSelectedOptions.indexOf(option);
			newSelectedOptions.splice(index, 1);
		} else {
			newSelectedOptions.push(option);
		}
		this.setState({selectedFilters: newSelectedOptions});
		console.log(this.state.selectedFilters);
	}

	onClearActionSelected() {
		console.log('onClearActionSelected');
		this.setState({selectedFilters: []});
	}

	onFilterActionSelected() {
		this.onCloseFilter();
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