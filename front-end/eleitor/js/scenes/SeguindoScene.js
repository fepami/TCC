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
import PoliticosListItem from '../components/PoliticosListItem';
import SearchBarIOS from '../components/SearchBarIOS';
import Placeholder from '../components/Placeholder';
import Filter from '../components/Filter';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import PoliticoPerfilScene from './PoliticoPerfilScene';
import ApiCall from '../api/ApiCall';
import {connect} from 'react-redux';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class SeguindoScene extends Component {	
	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
			politicosDataSource: ds.cloneWithRows([]),
			loading: true,
			listIsEmpty: false,
			errorState: false,
			isUsingFilter: false
		}
		this.onShowFilter = this.onShowFilter.bind(this);
		this.onCloseFilter = this.onCloseFilter.bind(this);
		this.onSubmitSearch = this.onSubmitSearch.bind(this);
		this.getSeguindo = this.getSeguindo.bind(this);
		this.renderLoadingOrView = this.renderLoadingOrView.bind(this);
		this.refresh = this.refresh.bind(this);
	}

	getSeguindo(filter) {
		if (filter) {
			this.setState({isUsingFilter: true});
		}
		var options = {
			token: this.props.token,
			...filter
		};
		let type = this.props.type ? '/' + this.props.type : '';
		ApiCall(`politicos_seguidos`, options, (jsonResponse) => {
			this.setState({politicosDataSource: ds.cloneWithRows(jsonResponse), loading: false, listIsEmpty: (jsonResponse.length === 0) ? true : false});
		}, (failedRequest) => {
			this.setState({errorState: true});
		});
	}

	refresh(filter) {
		if (!this.state.loading) {
			setTimeout(()=>{
				this.setState({errorState: false, listIsEmpty: false, loading: true, isUsingFilter: false});
				this.getSeguindo(filter);
			}, 1);
		} else {
			this.getSeguindo();
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

	renderLoadingOrView() {
		if (this.state.loading) {
			return (<LoadingOverlay/>)
		} else if (this.state.listIsEmpty) {
			if (this.state.isUsingFilter) {
				return (<Placeholder type='search' />)
			} else {
				return (<Placeholder type='follow' />)
			}
		} else if (this.state.errorState) {
			return (<Placeholder type='error' onPress={() => {
				this.refresh()}} />)
		} else {
			let type = this.props.type ? this.props.type : 'lista';
			return (
				<ListView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    dataSource={this.state.politicosDataSource} 
                    renderRow={(rowData) => <PoliticosListItem onPress={()=>this.onPoliticoPress(rowData)} politico={rowData} cellType={type}/>} />
			)
		}
	}

	chooseFilterIcon() {
		return Platform.select({
			ios: 'md-funnel',
			android: 'md-options'
		})
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

		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Seguindo'
					actions={actions} />
				<SearchBarIOS 
					onSubmitSearch={(text) => this.onSearchActionSelected(text)} 
					onCancelSearch={() => this.onSearchActionCanceled()}/>
				{this.renderLoadingOrView()}
                <Filter 
                	navigator={this.props.navigator} 
                	modalVisible={this.state.modalVisible} 
                	changeFilterVisibility={this.changeFilterVisibility.bind(this)} 
                	type={'politicos'}
                	title='Filtrar Políticos'
                	onFilterActionSelected={(filter) => this.onFilterActionSelected(filter)}
                	onClearFilterActionSelected={() => this.onClearFilterActionSelected()} />
			</View>
		)
	}

	onSearchActionSelected(filter) {
		this.refresh({special_filter: filter});
	}

	onSearchActionCanceled() {
		this.refresh();
	}

	onFilterActionSelected(filter) {
		this.onCloseFilter();
		this.refresh(filter);
	}

	onClearFilterActionSelected() {
		this.refresh();
	}
	
	onPoliticoPress(data) {
		this.props.navigator.push({component: PoliticoPerfilScene, passProps: data});
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

}

function mapStateToProps(store) {
	return {
		token: store.token.token
	}
}

export default connect(mapStateToProps)(SeguindoScene);

const styles = StyleSheet.create({

})