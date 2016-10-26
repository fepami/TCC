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
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import PoliticoPerfilScene from '../scenes/PoliticoPerfilScene';

export default class ListaPoliticosScene extends Component {
	constructor(props){
		super(props);
		this.onFilterActionSelected = this.onFilterActionSelected.bind(this);
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

	onFilterActionSelected() {

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
			onActionSelected: this.onFilterActionSelected
		},
		// {
		// 	title: 'Busca',
		// 	iconName: 'md-search',
		// 	show: 'always',
		// 	onActionSelected: this.onSubmitSearch
		// }
		];

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		let type = this.props.type ? this.props.type : 'lista';
		let title = this.props.type ? 'Ranking de Políticos' : 'Políticos';
		// const dataSource = ds.cloneWithRows([0,1,2,3,4,5,6,7,8,9,10]);
		const fakeData0 = {nome: 'NOME DO POLITICO', idade: 'IDADE', cargo: 'CARGO E LOCALIZACAO', vigencia: 'VIGENCIA DO CARGO', partido: 'NOME DO PARTIDO', vote: 'xxxx', ranking: '1', approval: '30'};
		const fakeData1 = {nome: 'helder', idade: '30 anos', cargo: 'presidente', vigencia: '29 de julho de 2005 a 24 de janeiro de 2012', partido: 'partido xyz', vote: '1234', ranking: '10', approval: '50'};
		const fakeData2 = {nome: 'marcela', idade: '24 anos', cargo: 'prefeito de sao paulo', vigencia: '1º de janeiro de 2013 até a atualidade', partido: 'partido abc', vote: '0987', ranking: '121', approval: '0'};
		const dataSource = ds.cloneWithRows([fakeData0, fakeData1, fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1]);
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title={title} 
					actions={actions} />
				<SearchBarIOS onSubmitSearch={(event) => alert(event.nativeEvent.text)}/>
				<ListView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    dataSource={dataSource} 
                    renderRow={(rowData) => <PoliticosListItem onPress={()=>this.onPress(rowData)} politico={rowData} cell_type={type}/>} />
			</View>
		)
	}

	onPress(data){
		this.props.navigator.push({component: PoliticoPerfilScene, passProps: data});
	}
}

const styles = StyleSheet.create({

})