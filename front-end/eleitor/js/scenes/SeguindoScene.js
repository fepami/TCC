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

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class SeguindoScene extends Component {	
	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
			politicosDataSource: ds.cloneWithRows([]),
			loading: true,
			listIsEmpty: false,
			errorState: false
		}
		this.onShowFilter = this.onShowFilter.bind(this);
		this.onCloseFilter = this.onCloseFilter.bind(this);
		this.onSubmitSearch = this.onSubmitSearch.bind(this);
		this.getSeguindo = this.getSeguindo.bind(this);
		this.renderLoadingOrView = this.renderLoadingOrView.bind(this);
		this.refresh = this.refresh.bind(this);
	}

	getSeguindo(token, filter) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = (e) => {
			if (request.readyState !== 4) {
				return;
			}

			if (request.status === 200) {
				const jsonResponse = JSON.parse(request.response);
				this.setState({politicosDataSource: ds.cloneWithRows(jsonResponse), loading: false, listIsEmpty: (jsonResponse.length === 0) ? true : false});
			} else {
				this.setState({errorState: true});
			}
		};

		const filterText = filter ? filter : '';
		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/politicos_seguidos?token=' + token + filterText);
		request.send();
	}

	refresh() {
		if (this.state.token) {
			if (!this.state.loading) {
				setTimeout(()=>{
					this.setState({errorState: false, listIsEmpty: false, loading: true});
					this.getSeguindo(this.state.token)
				}, 1);
			}
		} else {
			var _this = this;
			AsyncStorage.getItem('token', (err, result) => {
				_this.setState({token: result});
				_this.getSeguindo(result);
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

	renderLoadingOrView() {
		if (this.state.loading) {
			return (<LoadingOverlay/>)
		} else if (this.state.listIsEmpty) {
			return (<Placeholder type='follow' />)
		} else if (this.state.errorState) {
			return (<Placeholder type='error' onPress={() => {
				this.setState({errorState: false, loading: true}, this.getSeguindo(this.state.token))}} />)
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
				<SearchBarIOS onSubmitSearch={(event) => alert(event.nativeEvent.text)} />
				{this.renderLoadingOrView()}
                <Filter 
                	navigator={this.props.navigator} 
                	modalVisible={this.state.modalVisible} 
                	changeFilterVisibility={this.changeFilterVisibility.bind(this)} 
                	type={'politicos'}
                	title='Filtrar Políticos'
                	onFilterActionSelected={(filter) => this.onFilterActionSelected(filter)} />
			</View>
		)
	}

	onFilterActionSelected(filter) {
		console.log(filter);
		this.onCloseFilter();
		this.setState({errorState: false, listIsEmpty: false, loading: true}, this.getSeguindo(this.state.token, filter));
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

const styles = StyleSheet.create({

})