import React from 'react';
import { Switch, Route } from 'react-router-dom'
import NodeTree from './../../components/NodeTree'
import './styles.scss'

export default class NodeForm extends React.Component {
	
    constructor(props){
    	super(props);
    	this.state = {
    		loading: false,
    		redirect: false
    	}
    	this.deactivate = this.deactivate.bind(this);
    	this.send = this.send.bind(this);
    }
    
    send(){
    	this.setState({loading: true});
    	var formData = {
    		"personId": this.props.personId,
    		"role": this.props.role,
    		"name": this.refs.nameField.value,
    		"treeId": this.props.treeId
    	};
    	var nodeFormContext = this;
    	var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "/addNodeIntoDb");
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readyState == XMLHttpRequest.DONE){
                // document.write(xmlhttp.responseText); this is for debuging
				nodeFormContext.deactivate();
			}
		}
		xmlhttp.send(JSON.stringify(formData));	
		

		
    }
    

    deactivate(){
        this.props.deactivate();
        this.props.loadFunc();
    }
    
    activate(){
    	this.setState({
    		activated: true
    	});
    }


    render() { 	
    	if(this.state.loading){
    		return (
				<div className={ this.props.position+" node_form" }>
					<h3>Загрузка...</h3>
				</div>
			);
    	}
    	else{
    		return (
				<div className={ this.props.position+" node_form" }>
					<form method="POST" action="/addNodeIntoDb">
						<input type="text" name="name" ref="nameField" placeholder="Имя" />
						<input type="button" value="Отмена" onClick={ this.deactivate } className="cancel" />
						<input type="button" value="Сохранить" onClick={ this.send } className="save" />
						
					</form>
				</div>
			);
    	}
		
    }
}