import React from 'react';
import './style.scss';

export default class NodeInfo extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			active: false,
			loading: false,
			edit: false,
			person: {},
			tempData: {}
		};
		this.renderInfoWindow = this.renderInfoWindow.bind(this);
		this.renderLoadingWindow = this.renderLoadingWindow.bind(this);
		this.renderEditForm = this.renderEditForm.bind(this);
		this.loadData = this.loadData.bind(this);
		this.activate = this.activate.bind(this);
		this.deactivate = this.deactivate.bind(this);
		this.openForm = this.openForm.bind(this);
		this.onChange = this.onChange.bind(this);
		this.saveForm = this.saveForm.bind(this);
	}

	activate(){
		this.setState({active: true, loading: true});
		this.loadData();
	}

	openForm(){
		this.setState({edit: true});
	}

	onChange(e){
		let data = this.state.tempData;
		switch(e.target.name){
			case "name": data.name = e.target.value; break;
			case "lastname": data.lastname = e.target.value; break; 
			//case "patronim": data.patronim = e.target.value; break;
			case "birthDate": data.birthDate = e.target.value.split('-').reverse().join('.'); break;
			case "deadDate": data.deadDate = e.target.value.split('-').reverse().join('.'); break;
			case "image": data.uploadImage = Array.from(e.target.files)[0]; break;
		}
		this.setState({tempData: data});
	}

	loadData(){
		let personData = {};
		fetch("/getPersonInfo/"+this.props.personId)
				.then(response=>response.json())
				.then(data => {
	                if(data.status == "ok"){
	                	console.log(data);
	                	this.setState({person: data, tempData: data, loading: false});
	                }
                });
	}

	saveForm(){
		this.setState({loading: true});
		let formData = new FormData();
		formData.append("name", this.state.tempData.name);
        formData.append("birthDate", this.state.tempData.birthDate);
        formData.append("deadDate",this.state.tempData.deadDate);
        formData.append("personId",this.props.personId);
        if(this.state.tempData.uploadImage && this.state.tempData.uploadImage != null)
        	formData.append("image", this.state.tempData.uploadImage, this.state.tempData.uploadImage.name);
		fetch('/editPerson', {
                    method: 'post',
                    body: formData
                }).then((response) => response.json())
                .then(responseData => {
                    if (responseData.status === 'ok') {
                        this.setState({
                            edit: false
                        });
                        this.props.changeName(responseData.name);
                        this.activate();
                    }else{
                    	alert("error");
                    	console.log()
                    	this.activate();
                    }
                });
		
	}

	deactivate(){
		this.setState({active: false, loading: false, edit: false});	
	}

	renderInfoWindow(){
		let colorClass;
		var base_image;
		let personData = this.state.person;
		if(this.props.gender == "male"){
			colorClass = "male_image";
			if(personData.photo){
				base_image = "/getPersonPhoto/"+personData.photo, true;
			}
			else{
				base_image ="/icons/male_icon.png";
			}
		}
		else{
			colorClass = "female_image";
			if(personData.photo){
				base_image = "/getPersonPhoto/"+personData.photo;
			}
			else{
				base_image = "/icons/female_icon.png";	
			}
				
		}
		// определение возраста
		let ages = -1;
		if(personData.birthDate.length == 10){ 
			let splitFirstDate = personData.birthDate.split(".");
			let splitLastDate = [];
			if(personData.deadDate.length != 10){
				let endDate = new Date();
				splitLastDate[0] = endDate.getDate(); 
				splitLastDate[1] = endDate.getMonth()+1;
				splitLastDate[2] = endDate.getFullYear();
			}else{
				splitLastDate = personData.deadDate.split('.');
			}
			ages = (parseInt(splitLastDate[2])-parseInt(splitFirstDate[2])); // находим разницу в годах
			// если день рождения в году ещё не наступил, уменьшаем возраст на 1
			if((new Date(2000, splitFirstDate[1],splitFirstDate[0]))
				>(new Date(2000, splitLastDate[1],splitLastDate[0]))){ 
				ages--;
			}
		}
		ages = ages.toString(10);
		let birthDay = (ages>=0)?(<div><span>Дата рождения: </span><b>{personData.birthDate}</b></div>):(<div><span>Дата рождения: </span><b>-</b></div>);//
		let deadDate = (personData.deadDate.length == 10)?(<div><span>Дата смерти: </span><b>{personData.deadDate}</b></div>):(<div></div>);//
		let age = (ages>=0)?(<div><span>Возраст: </span><b>{ages}</b></div>):(<div></div>);//
		let editBtn = (this.props.canEdit)?(<div className="editBtn" onClick={this.openForm}>
												<img src="/icons/edit.png"/>
											</div>):(<div></div>);
		return (<div className="info_window">
					<div className={"image_place "+colorClass}>
						{editBtn}
						<div className="closeBtn" onClick={this.deactivate}>
							<img src="/icons/close.png"/>
						</div>
						<img src={base_image} className="photo"/>
					</div>
					<div className="infoBox">
						<div><span>Имя: </span><b>{personData.name}</b></div>
						<div><span>Фамилия: </span><b>{personData.lastname}</b></div>
						{birthDay}
						{deadDate}
						{age}

					</div>
				</div>);//
	}


	renderLoadingWindow(){
		let colorClass;
		let base_image;
		if(this.props.gender == "male"){
			colorClass = "male_image";
			base_image = "/icons/male_icon.png";
		}
		else{
			colorClass = "female_image";
			base_image = "/icons/female_icon.png";	
		}

		return (<div className="info_window">
					<div className={"image_place "+colorClass}>
						<div className="editBtn">
							<img src="/icons/edit.png"/>
						</div>
						<div className="closeBtn" onClick={this.deactivate}>
							<img src="/icons/close.png"/>
						</div>
						<img src={base_image} />
					</div>
					<div>
						<b>Зарузка...</b>
					</div>
				</div>);//
	}

	renderEditForm(){
		let colorClass;
		let base_image;
		if(this.props.gender == "male"){
			colorClass = "male_image";
			base_image = "/icons/male_icon.png";
		}
		else{
			colorClass = "female_image";
			base_image = "/icons/female_icon.png";	
		}

		let personData = this.state.person;

		let birthDate = personData.birthDate.split('.').reverse().join("-");
		let deadDate = personData.deadDate.split('.').reverse().join("-");
		return (<div className="info_window">
					<div>
						<div className="editBtn formControls" onClick={this.saveForm}>
							<img src="/icons/edit.png"/>
							<b>Сохранить</b>
						</div>
						<div className="closeBtn formControls" onClick={this.deactivate}>
							<img src="/icons/close.png"/>
						</div>
					</div>
					<div className="infoBox form">
						<span>Фотография: </span>
						<input type="file" name="image" onChange={this.onChange} accept=".png, .jpg, .jpeg" />
						<span>Имя: </span>
						<input defaultValue={personData.name} onChange={this.onChange} name="name" />
						<span>Фамилия: </span>
						<input value={personData.lastname} onChange={this.onChange} name="lastname" disabled/>
						<span>Дата рождения: </span>
						<input type="date" defaultValue={birthDate} onChange={this.onChange} name="birthDate" />
						<span>Дата смерти: </span>
						<input type="date" defaultValue={deadDate} onChange={this.onChange} name="deadDate" />
					</div>
				</div>);//
	}


	render(){
		if(this.state.active){
			if(this.state.loading == true){
				return this.renderLoadingWindow();	
			}
			else if(this.state.edit){
				return this.renderEditForm();
			}
			else{
				return this.renderInfoWindow();	
			}
			
		} else {
			return (<div className="info_button">
					<img src="/icons/info.png" onClick={this.activate} width="15px" height="15px"/>
				</div>
				);//
		}
	}

}