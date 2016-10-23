import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	ListView,
	Platform
} from 'react-native';
import PoliticosListItem from '../components/PoliticosListItem';
import Header from '../components/Header';

export default class ListaPoliticosScene extends Component {
	render(){
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		// const dataSource = ds.cloneWithRows([0,1,2,3,4,5,6,7,8,9,10]);
		const dataSource = ds.cloneWithRows([{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'},{name: 'marcela', position: 'faxineira'}, {name: 'helder', position: 'presidente'}]);
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
	}
}

const styles = StyleSheet.create({
})