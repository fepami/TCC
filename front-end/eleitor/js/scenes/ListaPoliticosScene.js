import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	ListView,
	Platform
} from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import PoliticosListItem from '../components/PoliticosListItem';
import SearchBarIOS from '../components/SearchBarIOS';
import Filter from '../components/Filter';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import PoliticoPerfilScene from '../scenes/PoliticoPerfilScene';
import {fakePoliticos, fakeFilter} from '../fakeData';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ListaPoliticosScene extends Component {	
	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
			selectedFilters: [],
			politicosDataSource: ds.cloneWithRows([]),
			loading: true
		}
		this.onShowFilter = this.onShowFilter.bind(this);
		this.onCloseFilter = this.onCloseFilter.bind(this);
		this.onSubmitSearch = this.onSubmitSearch.bind(this);
		this.getPoliticos = this.getPoliticos.bind(this);
		this.renderLoadingOrView = this.renderLoadingOrView.bind(this);
	}

	getPoliticos() {
		var request = new XMLHttpRequest();
		request.onreadystatechange = (e) => {
			if (request.readyState !== 4) {
				return;
			}

			if (request.status === 200) {
				const jsonResponse = JSON.parse(request.response);
				this.setState({politicosDataSource: ds.cloneWithRows(jsonResponse), loading: false});
			} else {
				console.warn('Erro: não foi possível conectar ao servidor.');
			}
		};

		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/politicos?device_id=device_id1');
		request.send();
	}

	componentDidMount() {
		this.getPoliticos();
	}

	chooseFilterIcon() {
		return Platform.select({
			ios: 'md-funnel',
			android: 'md-options'
		})
	}

	renderLoadingOrView() {
		if (this.state.loading) {
			return (<LoadingOverlay/>)
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

		let title = this.props.type ? 'Ranking de Políticos' : 'Políticos';
		// this.state.politicosDataSource = ds.cloneWithRows(fakePoliticos);
		const filterDataSource = ds.cloneWithRows(fakeFilter);

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
                	dataSource={filterDataSource}
                	title='Filtrar Políticos'
                	selectedFilters={this.state.selectedFilters}
                	onSelectFilter={(option) => this.onSelectFilter(option)} 
                	onClearActionSelected={() => this.onClearActionSelected()}
                	onFilterActionSelected={() => this.onFilterActionSelected()} />
			</View>
		)
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