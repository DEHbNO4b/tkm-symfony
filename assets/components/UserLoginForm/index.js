import React from 'react';
import './styles.scss'

export default class UserLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            password: "",
            error: false,
            done: false
        };
        // console.log("reg form construct");
        this.handleChangePhone = this.handleChangePhone.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goHome = this.goHome.bind(this);
    }

    handleChangePhone(event) {
        this.setState({login: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    goHome(){
        // console.log("goHome.navigate:");
        // console.log(this.props.router.navigate);
        this.props.router.navigate('/home');


        /*fetch("/home").then(response => response.text())
            .then(text => {
                document.write(text);
            });*/
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch("/login", {method: 'post', body: JSON.stringify({
               "phone": this.state.login,
               "password": this.state.password
            })
        }).then(response=>response.json()).then(data=>{
            // console.log("login_result");
            // console.log(data);

            if(data.result==="ok"){
                this.props.setUser({logined: "ok"});
                this.goHome();

            }
            else{
                this.setState({error: true});
            }
        });

    }

    render() {
        var errorTextClass = (this.state.error)?"errorBlock":"hiddenBlock";
        return (
            <div className="form">
                <div className={ errorTextClass } >
                        <div>
                            Ошибка: Неверный номер телефона или пароль
                        </div>
                        <div>

                        </div>
                    </div>
                <form onSubmit={this.handleSubmit} method="post">
                    <div>
                        <div>
                            Номер телефона:
                        </div>
                        <div className="inputBlock">
                            +<input type="text" name="phone" onChange={this.handleChangePhone} pattern="^[0-9]{11}$"
                                    title="Номер должен состоять из 11 цифр без пробелов" autocomplete="off"/>
                        </div>
                    </div>
                    <div>
                        <div>
                            Пароль:
                        </div>
                        <div className="inputBlock">
                            <input type="password" name="password" onChange={this.handleChangePassword}
                                   autocomplete="off"/>
                        </div>
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}