import React from 'react'
import NavLink from '../../components/NavLink'
import {Link, Outlet} from 'react-router-dom'
import './styles.scss';



export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.state = {
            user: {},
            isHome: false,
        };
        this.logoutHandler = this.logoutHandler.bind(this);
        this.loadData = this.loadData.bind(this);
        this.renderSearch = this.renderSearch.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
    }

    logoutHandler(event){
        fetch("/logout").then(response=>{
            this.loadData();
            this.props.setUser({});
        });  
    }

    componentDidMount() {
       // console.log("header");
        this.loadData();
    }

    componentDidUpdate(){
        if(this.props.getUser().logined && this.props.getUser().logined === "ok")
            this.loadData();
    }
    
    loadData(){
        fetch('/getCurrentUser')
            .then(response => response.json())
            .then(data => {
                this.props.setUser(data);
                this.setState({
                    user: data
                });
               // console.log("header");
            });
    }

    onSearchClick(){
        const query = this.textInput.value.replace(' ', '_');
        this.props.history.push('/search/'+query);
    }

    renderSearch(){

        if(location.pathname.split('/')[1]==='search'){
            return (<div/>);
        }

        return (
            <div className="header_search">
                <input name="search_string" ref={this.textInput} placeholder="Фамилия и\или Имя" className="search_string" />
                <input type="button" name="search" value="Найти" onClick={this.onSearchClick}/>

            </div>);
    }

    render() {
        const searchFiled = this.renderSearch();
        if(this.state.user.firstname){
            return (
                <header className="header">
                    <NavLink to='/'>Главная</NavLink> &nbsp; &nbsp;
                    <NavLink to='/aboutUs'>О проекте</NavLink> &nbsp; &nbsp;
                    <b>{ this.state.user.firstname }</b>&nbsp; &nbsp;
                    <NavLink to="/" onClick={ this.logoutHandler }>Выход</NavLink>&nbsp; &nbsp;
                    {searchFiled}
                </header>
            );
        }
        else{
            return (
                <header className="header">
                    <Link to="/">Главная</Link> &nbsp; &nbsp;
                    <Link to="/signUp">Зарегистрироваться</Link>
                    <span>&#xa0;&#47;&#xa0;</span>
                    <Link to="/signIn">Войти</Link> &nbsp; &nbsp;
                    <Link to="/aboutUs">О проекте</Link>
                    {searchFiled}
                </header>

            )
        }


    }
}
