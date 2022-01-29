import React from 'react'
import NavLink from '../../../components/NavLink'
import "./styles.scss";

export default class NewsBtn extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            treeID: 0
        };
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount(){
        this.setState({treeID: this.props.treeData.id});
        this.loadData();
    }

    loadData(){
        if(this.props.user && this.props.user.id 
            && this.props.user.id != 0 && this.state.treeID !=0){
            fetch('/userSubscribed/'+this.props.treeData.id)
                .then(response=>response.json())
                .then(respData=>{
                    if(respData.subscribed == true){
                        this.setState({subscribed : true});
                    }
                    else{
                        this.setState({subscribed : false});
                    }
                });
        }
    }

    subscribe(){
        fetch("/subscribe/"+this.props.treeData.id);
        this.setState({subscribed: true});
    }

    unsubscribe(){
        fetch("/unsubscribe/"+this.props.treeData.id);
        this.setState({subscribed: false});
    }

    componentDidUpdate(){
        if(this.props.treeData.id !=this.state.treeID){
            this.setState({treeID: this.props.treeData.id});
            this.loadData();
        }
    }

    render(){
        console.log(this.props.treeUsers);
        let subscribeBtn = <div></div>
        if(this.props.user && this.props.user.id && this.props.user.id != 0 
            && this.props.treeData.adminId != this.props.user.id 
            && !this.props.treeUsers.includes(this.props.user.id)){
            if(this.state.subscribed == false){
                
                subscribeBtn =  <div className="addNewsLinkBtn tree_button" onClick={this.subscribe}>
                                    <b>Подписаться</b>
                                </div>
            }
            else if(this.state.subscribed == true){
                subscribeBtn =  <div className="addNewsLinkBtn tree_button" onClick={this.unsubscribe}>
                                    <b>Отписаться</b>
                                </div>
            }
        }
        return (
            <div className="tree_controls">
                <div className="addNewsLinkBtn tree_button">
                    <b>
                        <NavLink to={"/news/tree/"+this.props.treeData.id}>Новости</NavLink>
                    </b>
                </div>
                {subscribeBtn}
            </div>);//
    }

}