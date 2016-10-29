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
					<View style={styles.box}>
						<TouchableElement onPress={this.props.onClearActionSelected} style={styles.button}>
							<Text>Limpar</Text>
						</TouchableElement>
						<TouchableElement onPress={this.props.onFilterActionSelected} style={styles.button}>
							<Text>Filtrar</Text>
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
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	}
})