import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	ListView,
	Platform,
	AsyncStorage
} from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import Placeholder from '../components/Placeholder';
import PropostasListItem from '../components/PropostasListItem';
import SearchBarIOS from '../components/SearchBarIOS';
import Filter from '../components/Filter';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import PropostaDetalheScene from './PropostaDetalheScene';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ListaPropostasScene extends Component {	
	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
			selectedFilters: [],
			propostasDataSource: ds.cloneWithRows([]),
			loading: true,
			listIsEmpty: false,
			errorState: false
		}
		this.onShowFilter = this.onShowFilter.bind(this);
		this.onCloseFilter = this.onCloseFilter.bind(this);
		this.onSubmitSearch = this.onSubmitSearch.bind(this);
		this.getPropostas = this.getPropostas.bind(this);
		this.renderLoadingOrView = this.renderLoadingOrView.bind(this);
		this.refresh = this.refresh.bind(this);
	}

	getPropostas(token, filter) {
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

		let type = this.props.type ? '/' + this.props.type : '';
		const filterText = filter ? filter : '';
		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/propostas' + type + '?token=' + token + filterText);
		request.send();
	}

	refresh() {
		if (this.state.token) {
			if (!this.state.loading) {
				setTimeout(()=>{
					this.setState({errorState: false, listIsEmpty: false, loading: true});
					this.getPropostas(this.state.token)
				}, 1);
			}
		} else {
			var _this = this;
			AsyncStorage.getItem('token', (err, result) => {
				_this.setState({token: result});
				_this.getPropostas(result);
			});
		}
	}

	componentDidMount() {
		this.refresh();
		this.props.navigator.refresh = this.refresh;
	}

	renderSearchBarIOS() {
		return Platform.select({
			ios: <SearchBarIOS onSubmitSearch={(event) => alert(event.nativeEvent.text)}/>
		})
	}

	chooseFilterIcon() {
		return Platform.select({
			ios: 'md-funnel',
			android: 'md-options'
		})
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

	renderLoadingOrView() {
		if (this.state.loading) {
			return (<LoadingOverlay/>)
		} else if (this.state.listIsEmpty) {
			return (<Placeholder type='search' />)
		} else if (this.state.errorState) {
			return (<Placeholder type='error' onPress={() => {
				this.setState({errorState: false, loading: true}, this.getPropostas(this.state.token))}} />)
		} else {
			let type = this.props.type ? this.props.type : 'lista';
			return (
				<ListView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.propostasDataSource} 
                    renderRow={(rowData) => <PropostasListItem onPress={()=>this.onPropostaPress(rowData)} proposta={rowData} cellType={type}/>} />
			)
		}
	}

	render(){
		let filterIcon = this.chooseFilterIcon();
		const actions = [
		{
			title: 'Filtro',
			iconName: filterIcon,
			show: 'always',
			onActionSelected: this.onShowFilter
		},
		// {
		// 	title: 'Busca',
		// 	iconName: 'md-search',
		// 	show: 'always',
		// 	on: this.onSubmitSearch
		// }
		];

		let title = this.props.type ? 'Ranking de Propostas' : 'Propostas';

		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title={title}
					actions={actions} />
				<SearchBarIOS onSubmitSearch={(event) => alert(event.nativeEvent.text)} />
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

	onFilterActionSelected(filter) {
		console.log(filter);
		this.onCloseFilter();
		this.setState({errorState: false, listIsEmpty: false, loading: true}, this.getPropostas(this.state.token, filter));
	}

	onPropostaPress(data) {
		this.props.navigator.push({component: PropostaDetalheScene, passProps: data});
	}
}

const styles = StyleSheet.create({

})