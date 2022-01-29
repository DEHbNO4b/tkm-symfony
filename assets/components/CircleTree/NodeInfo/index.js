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
		this.data = {};
		this.renderInfoWindow = this.renderInfoWindow.bind(this);
		this.renderLoadingWindow = this.renderLoadingWindow.bind(this);
		this.renderEditForm = this.renderEditForm.bind(this);
		this.loadData = this.loadData.bind(this);
		this.activate = this.activate.bind(this);
		this.deactivate = this.deactivate.bind(this);
		this.openForm = this.openForm.bind(this);
		this.onChange = this.onChange.bind(this);
		this.saveForm = this.saveForm.bind(this);
		this.isActive = this.isActive.bind(this);
	}

	isActive(){
		return this.state.active;
	}

	activate(){
		if((this.data.personId == 0 || this.data.isSpouse) && this.data.editable && !this.state.edit){
			this.setState({active: true, edit: true, loading: false, tempData: {}, person: {}});
		}
		else/* if(this.data.personId != 0)*/{
			console.log(this.data.personId == 0+" "+this.data.editable)
			this.setState({active: true, loading: true});
			this.loadData();
		}
		
	}

	openForm(){
		this.setState({edit: true});
	}

	setParams(x, y, gender, personId, editable, changeName, isSpouse, showLName){
		this.data.x=x;
		this.data.y=y;
		this.data.gender=gender;
		this.data.personId = personId;
		this.data.editable = editable;
		this.data.changeName = changeName;
		this.data.isSpouse = isSpouse;
		this.data.showLName = showLName;
		this.setState({needupdate: true});
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
		fetch("/getPersonInfo/"+this.data.personId)
				.then(response=>response.json())
				.then(data => {
	                if(data.status == "ok"){
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
        formData.append("personId",this.data.personId);
        if(this.state.tempData.uploadImage && this.state.tempData.uploadImage != null)
			formData.append("image", this.state.tempData.uploadImage, this.state.tempData.uploadImage.name);
		if(this.data.isSpouse){
			formData.append("isSpouse", this.data.isSpouse);
			formData.append("role", (this.data.gender == "male")?"husband":"wife");
		}
		fetch('/editPerson', {
                    method: 'post',
                    body: formData
                }).then((response) => response.json())
                .then(responseData => {
                    if (responseData.status === 'ok') {
                        this.setState({
                            edit: false
						});
						if(this.data.isSpouse){
							this.deactivate();
							this.props.loadFunc();
						}
                        this.data.changeName(responseData.name);
						this.activate();
						
                    }else{
                    	alert("error");
                    	this.activate();
                    }
                });
		
	}

	deactivate(){
		this.setState({active: false, loading: false, edit: false, needupdate: false});	
	}

	componentDidUpdate(){
		/*if(this.data.personId == 0 && this.data.editable && this.state.edit){
			this.setState({edit: true, loading: false});
		}*/
	}

	renderInfoWindow(){
		let colorClass;
		var base_image;
		let personData = this.state.person;
		if(!this.data.showLName){
			personData.lastname = "";
		}
		if(this.data.gender == "male"){
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
		if(personData.birthDate.length == 10 && personData.birthDate != "01.01.0001"){ 
			let splitFirstDate = personData.birthDate.split(".");
			let splitLastDate = [];
			if(personData.deadDate.length != 10 || personData.deadDate == "01.01.0001"){
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
		let deadDate = (personData.deadDate.length == 10 && personData.deadDate != "01.01.0001")?(<div><span>Дата смерти: </span><b>{personData.deadDate}</b></div>):(<div></div>);//
		let age = (ages>=0)?(<div><span>Возраст: </span><b>{ages}</b></div>):(<div></div>);//
		let editBtn = (this.data.editable)?(<div className="editBtn" onClick={this.openForm}>
												<img src="/icons/edit.png"/>
											</div>):(<div></div>);
		return (<div style={{
						position: "absolute",
						left: this.data.x+"px", 
						top: this.data.y+"px"}} 
					className="info_window">
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
		if(this.data.gender == "male"){
			colorClass = "male_image";
			base_image = "/icons/male_icon.png";
		}
		else{
			colorClass = "female_image";
			base_image = "/icons/female_icon.png";	
		}

		return (<div style={{
						position: "absolute",
						left: this.data.x+"px", 
						top: this.data.y+"px"}} 
					className="info_window">
					<div className={"image_place "+colorClass}>
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
		if(this.data.gender == "male"){
			colorClass = "male_image";
			base_image = "/icons/male_icon.png";
		}
		else{
			colorClass = "female_image";
			base_image = "/icons/female_icon.png";	
		}

		let personData = this.state.person;
		if(!this.data.showLName){
			personData.lastname = "";
		}
		let birthDate = (this.data.personId != 0 
			&& !this.data.isSpouse 
			&& personData.birthDate != "01.01.0001")?(personData.birthDate.split('.').reverse().join("-")):"";
		let deadDate = (this.data.personId != 0 
			&& !this.data.isSpouse 
			&& personData.deadDate != "01.01.0001")?(personData.deadDate.split('.').reverse().join("-")):"";
		return (<div style={{
						position: "absolute",
						left: this.data.x+"px", 
						top: this.data.y+"px"}}
					className="info_window">
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
			return (<div></div>);//
		}
	}

}