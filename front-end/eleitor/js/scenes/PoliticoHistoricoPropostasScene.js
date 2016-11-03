import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	ListView,
	Platform
} from 'react-native';
import Filter from '../components/Filter';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import PropostasListItem from '../components/PropostasListItem';
import PropostaDetalheScene from '../scenes/PropostaDetalheScene';
import {fakePropostas, fakeFilter} from '../fakeData';

export default class PoliticoHistoricoPropostasScene extends Component {
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

	render() {
		let filterIcon = this.chooseFilterIcon();
		const actions = [
		{
			title: 'Filtro',
			iconName: filterIcon,
			show: 'always',
			onActionSelected: this.onShowFilter
		}];
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		const propostasDataSource = ds.cloneWithRows(fakePropostas);
		const filterDataSource = ds.cloneWithRows(fakeFilter);

		return(
			<View style={{flex: 1}}>
				<Header
					navigator={this.props.navigator}
					title='Histórico de Propostas'
					actions={actions} />
				<View style={styles.cell}>
					<Image
						style={styles.roundedimage}
						source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}} />
					<View style={styles.info}>
						<Text style={styles.h1}>{this.props.nome}</Text>
						<Text>{this.props.cargo}</Text>
						<Text>{this.props.partido}</Text>
					</View>
				</View>
				<View style={{height: 3, borderBottomWidth: 1, borderColor: 'black'}}></View>
				<ListView
					style={{flex: 1}}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    dataSource={propostasDataSource} 
                    renderRow={(rowData) => <PropostasListItem onPress={()=>this.onPropostaPress(rowData)} proposta={rowData} cellType={'lista'}/>} />
                <Filter 
                	navigator={this.props.navigator} 
                	modalVisible={this.state.modalVisible} 
                	changeFilterVisibility={this.changeFilterVisibility.bind(this)} 
                	dataSource={filterDataSource}
                	title='Filtrar Propostas'
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
		paddingHorizontal: 15
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