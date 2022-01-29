import React from 'react';
import './styles.scss';

export default class NodeInvite extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			active: false,
			loading: false,
			link: ""
		}
		this.onInviteClick = this.onInviteClick.bind(this);
		this.onCopyClick =this.onCopyClick.bind(this);
	}

	onInviteClick(){
		if(this.props.personId && this.props.personId != 0)
		{
			this.setState({
			active: !this.state.active,
			loading: true
		});

		fetch("/getInviteLink/"+this.props.personId)
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

	onCopyClick(){
		this.refs.linkField.disabled = false;
		this.refs.linkField.select();
		document.execCommand("copy");
		this.refs.linkField.disabled = true;
		this.onInviteClick();
	}

	activeRender(){
		return (
			<div className="active_invite_form">
				<div className="invite_plus_button" onClick={this.onInviteClick}>
					<img src="/icons/share.png" width="15px" height="15px"/>
				</div>
				<div className="invite_form">
					<form ref="inviteForm">
						<b>Приглашение персоны по ссылке:</b><br />
						<input type="text" value={this.state.link} ref = "linkField" disabled /><br />
						<input type="button" value="Отменить" className="cancel" onClick={this.onInviteClick}/>
						<input type="button" value="Скопировать" className = "copy" onClick={this.onCopyClick} />
					</form>
				</div>
			</div>);//
	}

	loadRender(){
		return (
			<div className="active_invite_form loading">
				<div className="invite_plus_button" onClick={this.onInviteClick}>
					<img src="/icons/share.png" width="15px" height="15px"/>
				</div>
				<b>Генерация ссылки...</b>
			</div>);//	
	}

	render(){
		if(this.state.active){
			if(this.state.loading)
				return this.loadRender();
			return this.activeRender();	

		}
		return (<div className="invite_plus_button" onClick={this.onInviteClick}><img src="/icons/share.png" width="15px" height="15px"/></div>);
	}
}