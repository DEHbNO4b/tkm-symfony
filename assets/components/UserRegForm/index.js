import React from 'react';
import { useLocation } from 'react-router-dom';


export default class UserRegForm extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            mobileNumber: '',
            email: '',
			pas: '',
			pass: '',
			done: false,

        };




        this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
        this.handleChangeLastName = this.handleChangeLastName.bind(this);
		this.handleChangePas = this.handleChangePas.bind(this);
		this.handleChangePass = this.handleChangePass.bind(this);
        this.handleChangeMobileNumber = this.handleChangeMobileNumber.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goHome = this.goHome.bind(this);
		this.pasNotFormat = this.pasNotFormat.bind(this);
		this.inputNotFormat = this.inputNotFormat.bind(this);
    }


    componentDidMount(){

		//console.log(this.props.router.params);
		if(this.props.router.params.hash){
			let hash = this.props.router.params.hash;
			fetch("/getPersonByHash/"+hash)
				.then(response => response.json())
				.then(data => {
					if(data.status === "ok"){
						this.setState({
							firstname: data.name,
							lastname: data.lastname
						});
					}
				});
		}
    }
	
	pasNotFormat(string){
		let result = false;
		let myRe = '^[0-9,a-z,A-Z]+$';
		if(string === ''){result = true;} else
		if(string.length < 2){result = true;} else
		if(string.search(myRe) < 0){result = true;}
		
		return result;
	}
	
	inputNotFormat(string, type){
		let result = false;
		let myRe = '';

		if(type == 'name' || type == 'last_name'){
			myRe = '^[a-z,A-Z,А-Я,а-я]+$';
	        if(string == ''){result = true;} else
			if(string.length < 2){result = true;} else
			if(string.search(myRe) < 0){result = true;}
		}
	
		if(type == 'phone'){
		    myRe = '^[0-9]{11}$';
			if(string == ''){result = true;} else
			if(string.search(myRe) < 0){result = true;}
		}
		
		if(type == 'email'){
			if(string != ''){
			myRe = '^[a-z,A-Z,0-9,_,-,.]*[a-z,A-Z,0-9,-]+@[a-z,A-Z,0-9,_,-,.]*[a-z,A-Z,0-9,-]+[.]+[a-z,A-Z]{2,}$';
			//myRe = '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
			if(string.search(myRe) < 0){result = true;}
			}
		}
		
		return result;
	}
	
    handleChangeFirstName(event) {
        this.setState({firstname: event.target.value});
		if(this.inputNotFormat(event.target.value, 'name')){event.target.style.backgroundColor = '#ff9d9d';} else
		{event.target.style.backgroundColor = '#ffffff';}
    }

    handleChangeLastName(event) {
        this.setState({lastname: event.target.value});
		if(this.inputNotFormat(event.target.value, 'last_name')){event.target.style.backgroundColor = '#ff9d9d';} else
		{event.target.style.backgroundColor = '#ffffff';}
    }
	
	handleChangePas(event) {
        this.setState({pas: event.target.value});
		if(this.pasNotFormat(event.target.value)){event.target.style.backgroundColor = '#ff9d9d';} else
		{event.target.style.backgroundColor = '#ffffff';}
    }
	
	handleChangePass(event) {
        this.setState({pass: event.target.value});
		if(this.pasNotFormat(event.target.value)){event.target.style.backgroundColor = '#ff9d9d';} else
		if(event.target.value != this.state.pas){event.target.style.backgroundColor = '#ff9d9d';} else
		{event.target.style.backgroundColor = '#ffffff';}
    }
    
    handleChangeMobileNumber(event) {
        this.setState({mobileNumber: event.target.value});
		if(this.inputNotFormat(event.target.value, 'phone')){event.target.style.backgroundColor = '#ff9d9d';} else
		{event.target.style.backgroundColor = '#ffffff';}
    }
    
    handleChangeEmail(event) {
        this.setState({email: event.target.value});
		if(this.inputNotFormat(event.target.value, 'email')){event.target.style.backgroundColor = '#ff9d9d';} else
		{event.target.style.backgroundColor = '#ffffff';}
    }

    goHome(){
        this.props.router.navigate('/home');
        fetch("/home").then(response => response.text())
            .then(text => {
                document.write(text);
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        let hash = (this.props.router.params.hash)?this.props.router.params.hash:"";
		if(!this.inputNotFormat(this.state.firstname, 'name')){
			if(!this.inputNotFormat(this.state.lastname, 'last_name')){
				if(!this.pasNotFormat(this.state.pas) && this.state.pas === this.state.pass){
					if(!this.inputNotFormat(this.state.mobileNumber, 'phone')){
						if(!this.inputNotFormat(this.state.email, 'email')){
							fetch('/addUserIntoDb', {
								method: 'post',
								headers: {'Content-Type':'application/json'},
								body: JSON.stringify({
									"firstname": this.state.firstname,
									"lastname": this.state.lastname,
									"mobileNumber": this.state.mobileNumber,
									"email": this.state.email,
									"password": this.state.pas,
									"hash": hash
								})  
							})
							.then((response) => response.json())
							.then(responseData => {
								if (responseData.result === 'ok') {
									//console.log('success');
									this.goHome();
								} else {
									//console.log('handle error');
								}
							}).catch(error => {
								//console.log('handle throw error');
							});
						} else {
							alert("Некорректно заполнен E-mail!");
						}	
					} else {
						alert("Некорректно заполнен номер телефона!");
					}	
				} else {
					alert("Некорректный пароль или пароли не совпадают!");
				}
			} else {
					alert("Некорректно заполнено поле фамилия!");
				}
		}else {
			alert("Некорректно заполнено поле имя!");
		}
    }

    render() {
        return (
            <div className="forms">
				<form onSubmit={this.handleSubmit} method="post">
					<div className="formLine">
						<div className="firstColumn">
							Имя
						</div>
						<div className="secondColumn">
							<input type="text" value={this.state.firstname} onChange={this.handleChangeFirstName} />
						</div>
					</div>

					<div className="firstColumn">
						Фамилия
					</div>
					<div className="secondColumn">
						<input type="text" name="lName" value={this.state.lastname} onChange={this.handleChangeLastName} />
					</div>
					<div className="firstColumn">
						Пароль
					</div>
					<div className="secondColumn">
						<input type="password" name="pas" value={this.state.pas} onChange={this.handleChangePas} />
					</div>
					<div className="firstColumn">
						Повторите пароль
					</div>
					<div className="secondColumn">
						<input type="password" name="pass" value={this.state.pass} onChange={this.handleChangePass} />
					</div>
					<div className="firstColumn">
						Номер мобильного телефона
					</div>
					<div className="secondColumn">
						+<input type="text" value={this.state.mobileNumber} onChange={this.handleChangeMobileNumber} />
					</div>
					<div className="firstColumn">
						E-mail
					</div>
					<div className="secondColumn">
						<input type="text" value={this.state.email} onChange={this.handleChangeEmail} />
					</div>
					<input type="submit" value="Submit" />
				</form>
            </div>
        );
    }
}