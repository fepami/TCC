import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	Modal,
	ListView,
	Platform,
	AsyncStorage
} from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import Placeholder from '../components/Placeholder';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from './Header';
import TouchableElement from './TouchableElement';
import FilterListTopic from './FilterListTopic';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Filter extends Component {
	constructor(props){
		super(props);
		this.state = {
			filterDataSource: ds.cloneWithRows([]),
			selectedFilters: [],
			loading: true,
			listIsEmpty: false,
			errorState: false
		}
		this.getFiltro = this.getFiltro.bind(this);
		this.renderLoadingOrView = this.renderLoadingOrView.bind(this);
		this.onSelectFilter = this.onSelectFilter.bind(this);
	}

	closeModal(){
		this.props.changeFilterVisibility(false)
	}

	getFiltro(token) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = (e) => {
			if (request.readyState !== 4) {
				return;
			}

			if (request.status === 200) {
				const jsonResponse = JSON.parse(request.response);
				this.setState({filterDataSource: ds.cloneWithRows(jsonResponse), loading: false, listIsEmpty: (jsonResponse.length === 0) ? true : false});
			} else {
				this.setState({errorState: true});
			}
		};

		request.open('GET', 'http://ec2-52-67-189-113.sa-east-1.compute.amazonaws.com:3000/filtro/' + this.props.type + '?token=' + token);
		request.send();
	}

	componentDidMount() {
		var _this = this;
		AsyncStorage.getItem('token', (err, result) => {
			_this.setState({token: result});
			_this.getFiltro(result);
		});
	}

	renderLoadingOrView() {
		if (this.state.loading) {
			return (<LoadingOverlay/>)
		} else if (this.state.listIsEmpty) {
			return (<Placeholder type='search' />)
		} else if (this.state.errorState) {
			return (<Placeholder type='error' onPress={() => {
				this.setState({errorState: false, loading: true}, this.getFiltro(this.state.token))}} />)
		} else {
			return (
				<View>
					<ListView
						style={{flex: 1}}
	                    enableEmptySections={true}
	                    automaticallyAdjustContentInsets={false}
	                    dataSource={this.state.filterDataSource} 
	                    selectedOptions={this.state.selectedFilters}
	                    renderRow={(rowData) => <FilterListTopic 
	                    							title={rowData.topic}
	                    							options={rowData.options}
								                	selectedOptions={this.state.selectedFilters}
								                	onSelectFilter={(title, option) => this.onSelectFilter(title, option)}/>} />
					<View style={styles.box}>
						<TouchableElement onPress={this.onClearActionSelected.bind(this)} style={[styles.button, {backgroundColor: '#575757'}]}>
							<Text style={{fontWeight: 'bold', color: 'white'}}>Limpar</Text>
						</TouchableElement>
						<TouchableElement onPress={this.props.onFilterActionSelected} style={[styles.button, {backgroundColor: '#33CCCC'}]}>
							<Text style={{fontWeight: 'bold', color: 'white'}}>Filtrar</Text>
						</TouchableElement>
					</View>
				</View>
			)
		}
	}

  	render() {
  		const closeModal = {
			icon: 'md-close',
			onPress: this.closeModal.bind(this)
		};
		
		return(
			<Modal 
				animationType={'slide'}
				transparent={false}
				visible={this.props.modalVisible}
				onRequestClose={() => this.props.changeFilterVisibility(false)} >
				<View style={[Platform.select({android: styles.androidView}), {flex: 1}]}>
					<Header
						navigator={this.props.navigator}
						title={this.props.title}
						leftItem={closeModal} />
					{this.renderLoadingOrView()}
				</View>
			</Modal>
		)
	}

	onSelectFilter(title, option) {
		console.log(title + ' - ' + option);
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
}

const styles = StyleSheet.create({
	androidView: {
		paddingTop: -25
	},
	box: {
		height: 100,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		width: 100,
		height: 40,
		margin: 15,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	}
})