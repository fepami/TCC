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
import ApiCall from '../api/ApiCall';
import {connect} from 'react-redux';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class ListaPropostasScene extends Component {	
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

	getPropostas(filter) {
		if (this.state.filter && !filter) {
			filter = this.state.filter;
		}
		var options = {
			token: this.props.token,
			...filter
		};
		let type = this.props.type ? '/' + this.props.type : '';
		ApiCall(`propostas${type}`, options, (jsonResponse) => {
			if (Array.isArray(jsonResponse)) {
				this.setState({propostasDataSource: ds.cloneWithRows(jsonResponse), loading: false, listIsEmpty: (jsonResponse.length === 0) ? true : false});					
			} else {
				this.setState({errorState: true, loading: false});
			}
		}, (failedRequest) => {
			this.setState({errorState: true});
		});
	}

	refresh(filter) {
		if (!this.state.loading) {
			setTimeout(()=>{
				this.setState({errorState: false, listIsEmpty: false, loading: true});
				this.getPropostas(filter);
			}, 1);
		} else {
			this.getPropostas();
		}
	}

	componentDidMount() {
		this.refresh();
		this.props.navigator.refresh = this.refresh;
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
				this.refresh()}} />)
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
				<SearchBarIOS 
					onSubmitSearch={(text) => this.onSearchActionSelected(text)} 
					onCancelSearch={() => this.onSearchActionCanceled()}/>
				{this.renderLoadingOrView()}
                <Filter 
                	navigator={this.props.navigator} 
                	modalVisible={this.state.modalVisible} 
                	changeFilterVisibility={this.changeFilterVisibility.bind(this)} 
                	type={'propostas'}
                	title='Filtrar Propostas'
                	onFilterActionSelected={(filter) => this.onFilterActionSelected(filter)}
                	onClearFilterActionSelected={() => this.onClearFilterActionSelected()} />
			</View>
		)
	}

	onSearchActionSelected(filter) {
		this.setState({filter: {special_filter: filter}});
		this.refresh({special_filter: filter});
	}

	onSearchActionCanceled() {
		this.setState({filter: null});
		this.refresh();
	}

	onFilterActionSelected(filter) {
		this.setState({filter: filter});
		this.onCloseFilter();
		this.refresh(filter);
	}

	onClearFilterActionSelected() {
		this.setState({filter: null});
		this.refresh();
	}

	onPropostaPress(data) {
		this.props.navigator.push({component: PropostaDetalheScene, passProps: data});
	}
}

function mapStateToProps(store) {
	return {
		token: store.token.token
	}
}

export default connect(mapStateToProps)(ListaPropostasScene);

const styles = StyleSheet.create({

})