import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	ListView,
	Platform
} from 'react-native';
import {SearchBar} from 'react-native-search-bar';
import PoliticosListItem from '../components/PoliticosListItem';
import Header from '../components/Header';
import PoliticoPerfilScene from '../scenes/PoliticoPerfilScene';

export default class ListaPoliticosScene extends Component {
	render(){
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		// const dataSource = ds.cloneWithRows([0,1,2,3,4,5,6,7,8,9,10]);
		const fakeData0 = {nome: 'NOME DO POLITICO', idade: 'IDADE', cargo: 'CARGO E LOCALIZACAO', vigencia: 'VIGENCIA DO CARGO', partido: 'NOME DO PARTIDO', vote: 'xxxx'};
		const fakeData1 = {nome: 'helder', idade: '30 anos', cargo: 'presidente', vigencia: '29 de julho de 2005 a 24 de janeiro de 2012', partido: 'partido xyz', vote: '1234'};
		const fakeData2 = {nome: 'marcela', idade: '24 anos', cargo: 'prefeito de sao paulo', vigencia: '1º de janeiro de 2013 até a atualidade', partido: 'partido abc', vote: '0987'};
		const dataSource = ds.cloneWithRows([fakeData0, fakeData1, fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1,fakeData2, fakeData1]);
		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<Header
					navigator={this.props.navigator}
					title='Políticos' />
				<ListView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    dataSource={dataSource} 
                    renderRow={(rowData) => <PoliticosListItem onPress={()=>this.onPress(rowData)} politico={rowData}/>} />
			</View>
		)
	}

	onPress(data){
		console.log(data);
		this.props.navigator.push({component: PoliticoPerfilScene, passProps: data});
	}
}

const styles = StyleSheet.create({

})