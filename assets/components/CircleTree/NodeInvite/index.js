import React from 'react';
import './styles.scss';

export default class NodeInvite extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			active: false,
			loading: false,
			link: "",
			x:0,
			y:0
		}
		this.personId = 0;
		this.activate = this.activate.bind(this);
		this.deactivate = this.deactivate.bind(this);
		this.onCopyClick = this.onCopyClick.bind(this);
		this.setParams = this.setParams.bind(this);
	}

	setParams(x, y, personId){
		this.setState({x: x,
			 y: y});
		this.personId = personId;
		console.log(this.state.x+" "+this.state.y);
	}

	activate(){
		if(this.personId && this.personId != 0)
		{
			this.setState({
				active: true,
				loading: true
			});
			fetch("/getInviteLink/"+this.personId)
				.then(response => response.json())
				.then(data => {
					if(data.status == "ok"){
						this.setState({
							loading: false,
							link: data.link
						});
					}
				});	
		}
	}
	deactivate(){
		this.setState({
			active: false,
			loading: false
		})
	}

	onCopyClick(){
		this.refs.linkField.disabled = false;
		this.refs.linkField.select();
		document.execCommand("copy");
		this.refs.linkField.disabled = true;
		this.onInviteClick();
	}

	activeRender(){
		return (
			<div style={{
				position: "absolute",
				left: this.state.x+"px", 
				top: this.state.y+"px"}}  className="active_invite_form">
				<div className="invite_form">
					<form ref="inviteForm">
						<b>Приглашение персоны по ссылке:</b><br />
						<input type="text" value={this.state.link} ref = "linkField" disabled /><br />
						<input type="button" value="Отменить" className="cancel" onClick={this.deactivate}/>
						<input type="button" value="Скопировать" className = "copy" onClick={this.onCopyClick} />
					</form>
				</div>
			</div>);//
	}

	loadRender(){
		return (
			<div style={{
				position: "absolute",
				left: this.state.x+"px", 
				top: this.state.y+"px"}}  className="active_invite_form loading">
				<b>Генерация ссылки...</b>
			</div>);//	
	}

	render(){
		if(this.state.loading)
			return this.loadRender();
		else if(this.state.active)
			return this.activeRender();	
		else return (<div></div>);
	}
}