import React from 'react';
import './styles.scss'

export default class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            lastname: "",
            name: "",
            phone: "",
            email: ""
        };
    }

    componentDidMount() {
        fetch('/getCurrentUser')
            .then(response => response.json())
            .then(entries => {
                this.setState({
                    id: entries.userId,
                    lastname: entries.lastname,
                    name: entries.firstname,
                    phone: entries.mobileNumber,
                    email: entries.email
                });
            });
    }

    preparePhone(phone){
        if(phone && phone.length == 11)
            return "+"+phone[0]+" ("+phone.substring(1, 4)+") "+phone.substring(4, 7)+"-"+phone.substring(7, 9)+"-"+phone.substring(9);
        return "";
    }

    render() {
        return (
            <div className="userInfo">
                <span className="left_text">Профиль</span>  
                <div className="userInfoBlock">
                    <div className="userInfoRow lastname">
                        <span>{this.state.name} {this.state.lastname}</span>
                    </div>
                    <div className="userInfoRow">
                        {this.preparePhone(this.state.phone)}
                    </div>
                    <div className="userInfoRow">
                        {this.state.email}
                    </div>
                </div>
            </div>
        );
    }
}