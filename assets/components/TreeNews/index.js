import React from 'react';
import './styles.scss';
//import './NewsItem'
import NewsItem from '../Home/NewsItem'
import NavLink from '../../components/NavLink'

export default class TreeNews extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            news: [],
            user: {}
        };
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount(){
        
        this.setState({user: this.props.getUser()});
        this.loadData();
    }

    componentDidUpdate(){
        if(this.state.user != this.props.getUser()){
            this.setState({user: this.props.getUser()});
            this.loadData();
        }
    }

    loadData(){
        fetch("/news/tree/list/"+this.props.match.params.id)
            .then(response=>response.json())
            .then(data=>{
                this.setState({
                    news: data
                });
                
            });
    }
//{ firstname: "Эдуард", lastname: "Амшоков", mobileNumber: "79286927278", email: "test@test.ru", userId: 1, role: "isRoot" }

    render() {

        let newsList = this.state.news.map((news, k)=>{
                        return(<NewsItem news={news} key={k} userId={this.state.user.userId} />)
                    });

        if(this.state.news.length == 0){
            newsList = <div>Пока новостей нет</div>
        }

        let addNewsBtn = (<div></div>);
        if(this.state.user.role === "isRoot" || this.state.user.role === "isUser"){
            addNewsBtn = (
                <div className="addNewsLinkBtn">
                    <NavLink to="/news/add">Добавить новость</NavLink>
                </div>);
        }

        return (
            <div className='news'>
                <div className="addNewsLink">
                    <b>Новости</b>
                    {addNewsBtn}
                </div>
                {
                   newsList    
                }
            </div>
        )
    }
}
/*
<p>Новость 1</p>
                <p>Новость 2</p>
                <p>Новость 3</p>
                <p>Новость 4</p>
                <p>Новость 5</p>
                <p>Новость 6</p>
                <p>Новость 7</p>
                <p>Новость 8</p>
                <p>Новость 9</p>
                <p>Новость 10</p>
*/