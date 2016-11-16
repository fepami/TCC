import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	Modal,
	ListView,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from './Header';
import TouchableElement from './TouchableElement';
import FilterListTopic from './FilterListTopic';

export default class Filter extends Component {
	closeModal(){
		this.props.changeFilterVisibility(false)
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
					<ListView
						style={{flex: 1}}
	                    enableEmptySections={true}
	                    automaticallyAdjustContentInsets={false}
	                    dataSource={this.props.dataSource} 
	                    renderRow={(rowData) => <FilterListTopic 
	                    							title={rowData.topic}
	                    							options={rowData.options}
								                	selectedOptions={this.props.selectedFilters}
								                	onSelectFilter={(option) => this.props.onSelectFilter(option)}/>} />
					<View style={styles.box}>
						<TouchableElement onPress={this.props.onClearActionSelected} style={[styles.button, {backgroundColor: '#575757'}]}>
							<Text style={{fontWeight: 'bold', color: 'white'}}>Limpar</Text>
						</TouchableElement>
						<TouchableElement onPress={this.props.onFilterActionSelected} style={[styles.button, {backgroundColor: '#33CCCC'}]}>
							<Text style={{fontWeight: 'bold', color: 'white'}}>Filtrar</Text>
						</TouchableElement>
					</View>
				</View>
			</Modal>
		)
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