import React from 'react'
import { Routes, Route, Link, useLocation,  useNavigate,  useParams } from 'react-router-dom'
import UserRegForm from './../../components/UserRegForm';
import UserInfo from './../../components/UserInfo';
import Home from './../../components/Home';
import Header from './../../components/Header';
import LeftPart from './../../components/LeftPart';
import Footer from './../../components/Footer';
import NotFound from './../../components/NotFound';
import NewTreeForm from './../../components/NewTreeForm';
import UserLoginForm from './../../components/UserLoginForm';
import HomePage from './../../components/HomePage';
import NodeTree from './../../components/CircleTree';
//from './../../components/NodeTree'
import SearchPage from './../../components/SearchPage';
import NewsPage from './../../components/NewsPage';
import AboutUsPage from './../../components/AboutUsPage';
import TreeNews from './../../components/TreeNews';
import Test from './../../components/Test';


    //обертка для задействования хуков в классовых компонентах
function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        const location = useLocation();
        const navigate = useNavigate();
        const params = useParams();

        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

    //обертывание компонентов для задействования хуков
const WrappedUserRegForm = withRouter(UserRegForm);
const WrappedUserLoginForm = withRouter(UserLoginForm);
const WrappedNodeTree = withRouter(NodeTree);

    //основной классовый компонент
export default class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: {}
        };
        this.setUser = this.setUser.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    setUser(user){
        this.setState({user:user});
    }

    getUser(){
        return this.state.user;
    }
    render() {
        return (
            <div className="app">
                <Header {...(this.props)} getUser={this.getUser} setUser={this.setUser} />
                <div className="container clearfix">
                    <LeftPart />
                    <main className="content">
                        <Routes>
                            <Route path="/signUp" element={<WrappedUserRegForm /> } />
                            <Route path="/signIn" element={<WrappedUserLoginForm {...(this.props)}  getUser={this.getUser} setUser={this.setUser} />} />
                            <Route path="/profile" element={ <UserInfo />} />
                            <Route path="/join/:hash" element={ <WrappedUserRegForm /> } />
                            <Route path="/search/:searchString" element = { <SearchPage /> } />
                            <Route path="/showTree/:id" element={<WrappedNodeTree {...(this.props)} getUser={this.getUser} />} />
                            <Route path="/home" element ={ <HomePage /> } />
                            <Route path="/news/edit/:id" element={<NewsPage {...(this.props)} getUser={this.getUser} />} />
                            <Route path="/news/add" element={<NewsPage {...(this.props)} getUser={this.getUser} />} />
                            <Route path="/news/tree/:id" element={<TreeNews {...(this.props)} getUser={this.getUser} />} />
                            <Route path="/aboutUs" element ={ <AboutUsPage />} />
                            <Route path="/" element={<Home {...(this.props)} getUser={this.getUser} />} />
                            <Route path="*" element ={ <NotFound /> } />
                        </Routes>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }
}
