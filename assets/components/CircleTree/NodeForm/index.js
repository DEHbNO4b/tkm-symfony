import React from 'react';
import './styles.scss'

export default class NodeForm extends React.Component {
	
    constructor(props){
    	super(props);
    	this.state = {
    		loading: false,
				redirect: false,
				activated: false,
				x: 0,
				y: 0
    	}
			this.deactivate = this.deactivate.bind(this);
			this.activate = this.activate.bind(this);
			this.isActive = this.isActive.bind(this);
			this.send = this.send.bind(this);
			this.setParams = this.setParams.bind(this);
    }
    
    send(){
    	this.setState({loading: true});
    	var formData = {
    		"personId": this.state.personId,
    		"role": this.state.role,
    		"name": this.refs.nameField.value,
    		"treeId": this.props.treeId
    	};
    	var nodeFormContext = this;
    	var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "/addNodeIntoDb");
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readyState == XMLHttpRequest.DONE){
				nodeFormContext.deactivate(true);
			}
		}
		xmlhttp.send(JSON.stringify(formData));	
    }
	
	isActive(){
		return this.state.activated;
	}

	setParams(x, y, personId, role){
		this.setState({x: x, y:y, personId: personId, role: role});
	}

    deactivate(load = false){
		this.setState({
			activated: false,
			loading: false
		});
		if(load){
			this.props.loadFunc();
		}
		
    }
    
    activate(){
    	this.setState({
    		activated: true
    	});
    }


    render() { 	
    	if(this.state.loading){
    		return (
				<div style={{
					position: "absolute",
					left: this.state.x+"px", 
					top: this.state.y+"px"}} className={ this.props.position+" node_form" }>
					<h3>Загрузка...</h3>
				</div>
			);
    	}
    	else if(this.state.activated){
    		return (
				<div style={{
						position: "absolute",
						left: this.state.x+"px", 
						top: this.state.y+"px"}} className={ this.props.position+" node_form" }>
					<form method="POST" action="/addNodeIntoDb">
						<input type="text" name="name" ref="nameField" placeholder="Имя" />
						<input type="button" value="Отмена" onClick={ this.deactivate } className="cancel" />
						<input type="button" value="Сохранить" onClick={ this.send } className="save" />
					</form>
				</div>
			);
		}
		else{
			return (<div></div>);
		}
		
    }
}