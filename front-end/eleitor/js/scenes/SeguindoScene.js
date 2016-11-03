import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	ListView,
	Platform
} from 'react-native';
import PoliticosListItem from '../components/PoliticosListItem';
import SearchBarIOS from '../components/SearchBarIOS';
import Filter from '../components/Filter';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import PoliticoPerfilScene from '../scenes/PoliticoPerfilScene';
import {fakePolitico0, fakePolitico1, fakeFilter} from '../fakeData';

export default class SeguindoScene extends Component {	
	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
			selectedFilters: []
		}
		this.onShowFilter = this.onShowFilter.bind(this);
		this.onCloseFilter = this.onCloseFilter.bind(this);
		this.onSubmitSearch = this.onSubmitSearch.bind(this);
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

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		let type = this.props.type ? this.props.type : 'lista';
		const politicosDataSource = ds.cloneWithRows([fakePolitico0, fakePolitico1]);
		const filterDataSource = ds.cloneWithRows(fakeFilter);

		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Seguindo'
					actions={actions} />
				<SearchBarIOS onSubmitSearch={(event) => alert(event.nativeEvent.text)} />
				<ListView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    dataSource={politicosDataSource} 
                    renderRow={(rowData) => <PoliticosListItem onPress={()=>this.onPoliticoPress(rowData)} politico={rowData} cellType={type}/>} />
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
}

const styles = StyleSheet.create({

})