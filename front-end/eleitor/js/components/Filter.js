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
import Header from '../components/Header';
import TouchableElement from '../components/TouchableElement';
import FilterListTopic from '../components/FilterListTopic';

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
				<View style={Platform.select({android: styles.androidView})}>
					<Header
						navigator={this.props.navigator}
						title='Filtro'
						leftItem={closeModal} />
					<ListView
	                    enableEmptySections={true}
	                    automaticallyAdjustContentInsets={false}
	                    dataSource={this.props.dataSource} 
	                    renderRow={(rowData) => <FilterListTopic 
	                    							title={rowData.topic}
	                    							options={rowData.options}
								                	selectedOptions={this.props.selectedFilters}
								                	onSelectFilter={(option) => this.props.onSelectFilter(option)}/>} />
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	androidView: {
		paddingTop: -25
	}
})