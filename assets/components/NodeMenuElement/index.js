import React from 'react';
import './styles.scss'

export default class NodeMenuElement extends React.Component {
    //{ name } ({ gender }) ({ parentId }) ({ personId })
    constructor(props){
    	super(props);
    	this.state = {
    		activated: false,
    		data: this.prepareData(this.props)
    	};
    	this.activate = this.activate.bind(this);
    	this.deactivate = this.deactivate.bind(this);
    }
    
    
    deactivate(){
    	this.setState({
    		activated: false
    	});
    }
    
    activate(){
    	this.props.deselectAll();
    	this.setState({
    		activated: true
    	});
    	this.props.setForm(this.props.role, this.state.data.formPosition);
    }
    
    prepareData(properties){
    	var props = {};
    	switch(properties.role){
			case "father": props = {
				label: "Отец",
				classNameValue: "sided_right male",
				formPosition: "left top"
				};
				break;
			case "mother": props = {
				label: "Мать",
				classNameValue: "female",
				formPosition: "right top"
				};
				break;
			case "brother": props = {
				label: "Брат",
				classNameValue: "male",
				formPosition: "left top"
				};
				break;
			case "sister": props = {
				label: "Сестра",
				classNameValue: "female",
				formPosition: "left bottom"
				};
				break;
			case "husband": props = {
				label: "Муж",
				classNameValue: "sided_right male",
				formPosition: "right top"
				};
				break;
			case "wife": props = {
				label: "Жена",
				classNameValue: "sided_right female",
				formPosition: "right bottom"
				};
				break;
			case "son": props = {
				label: "Сын",
				classNameValue: "sided_right male",
				formPosition: "left bottom"
				};
				break;
			case "daughter": props = {
				label: "Дочь",
				classNameValue: "female",
				formPosition: "right bottom"
				};
				break;
    	}
    	return props;
    }
    
    render() {
    	var data = this.prepareData(this.props);
    	if(this.state.activated){
    		data.classNameValue+=" active";
    	}    	
    	if(this.props.hidings != null){
			  if(this.props.hidings == true){
			  	return (
			  		<div className={ data.classNameValue+" deactivate" }>
			  		{data.label}
			  		</div>
			  		);//
			  }   		
    	}
		return (
			<div className={ data.classNameValue } 
				onClick={ this.activate }>{ data.label }</div>
		);
    }
}