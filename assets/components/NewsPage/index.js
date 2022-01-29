import React from 'react';
import './styles.scss';
import { Route } from 'react-router-dom'


export default class NewsPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            images: [],
            user: {},
            imgSources: []
        };

        this.rootStateValues = [
            {
                value: "Черновик",
                key: 0
            }, 
            {
                value: "Опубликовано",
                key: 1
            }];
        this.userStateValues = [
            {
                value: "Черновик",
                key: 0
            }, 
            {
                value:"Для родственников", 
                key: 2
            }, 
            {
                value: "Для всех (родственники, подписчики, гости страницы рода)",
                key:3
            }];

        this.onFileSelected = this.onFileSelected.bind(this);
        this.onAddImageClick = this.onAddImageClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount(){
        fetch("/getCurrentUser")
        .then(response => response.json())
        .then(data => {
            if(data && data.role 
                && (data.role == "isRoot" || data.role == "isUser")){
                this.setState({user:data});
                this.loadData();
            }
            else{
                this.props.history.push('/');
            }
        });
    }

    loadData(){
        let newsId = (this.props.match.params.id)?this.props.match.params.id:0;
        if(newsId != 0){
            fetch("/news/info/"+newsId)
            .then(response=>response.json())
            .then(responseData=>{
                if(responseData.status == "ok"){
                    let newsState = 0;
                    if(this.state.user.role == "isRoot") {
                        newsState = this.rootStateValues.filter(state=>(state.key==responseData.state))[0];
                    }
                    else{
                        newsState = this.userStateValues.filter(state=>(state.key==responseData.state))[0];
                    }
                    this.setState({data :{
                        id: newsId,
                        header: responseData.header,
                        text: responseData.text,
                        state: newsState.value,
                        video: responseData.video                
                        },
                        imgSources: ["/news/image/"+responseData.image]
                    });
                }
            });
        } else {
            this.setState({data: {
                header: '',
                text: '',
                state: "Черновик",
                video: ''
            }});
        }
    }

    onSubmit(e){
        let formData = new FormData();
        formData.append("header", this.state.data.header);
        formData.append("text", this.state.data.text);
        formData.append("video", this.state.data.video);
        let newsState;
        if(this.state.user.role == "isRoot") {
            newsState = this.rootStateValues.filter(state=>(state.value==this.state.data.state))[0];
        }
        else{
            newsState = this.userStateValues.filter(state=>(state.value==this.state.data.state))[0];
        }
        // = this.rootStateValues.filter(state=>(state.value==this.state.data.state))[0];
        if(newsState)
            formData.append("state", newsState.key);
        else
            formData.append("state", 0);
        if(this.state.data.id && this.state.data.id != 0){
            formData.append("id", this.state.data.id);
        }

        if(this.state.images[0] && this.state.images[0] != null){
            formData.append("image", this.state.images[0]);
        }
        
        fetch("/news/save", {
            method: 'post',
            body: formData
        })
            .then((response)=>response.json())
            .then(responseData => {
                this.props.history.push("/");
            });
    }

    onInputChange(e){
        let data = this.state.data;
        switch(e.target.name){
            case "header": data.header = e.target.value; break;
            case "text": data.text = e.target.value; break;
            case "video": data.video = e.target.value; break;
            case "state": data.state = e.target.value; break;
        }
        this.setState({data: data});
    }

    onFileSelected(e){
        let images = [];//this.state.images;
        let imgSources = [];//this.state.imgSources;
        let nImage = Array.from(e.target.files)[0];
        let context = this;
        if(nImage.size>1600000){
            alert("Файл слишком большой. Размер файла не должен превышать 1.6Мб.");
            return;
        }
        var reader = new FileReader();
        reader.onload =  (e) => this.setState({imgSources: imgSources.concat([e.target.result])});
        reader.readAsDataURL(nImage);
        this.setState({images: images.concat(nImage)});
    }

    onAddImageClick(e){
        //if(this.state.images.length <=5)
            this.refs.selector.click();
    }


    render(){

        let data = this.state.data;
        let selected;
        if(this.state.user.role == "isRoot") {
            selected = this.rootStateValues.filter(state=>(state.value == this.state.data.state))[0];
        }
        else{
            selected = this.userStateValues.filter(state=>(state.value == this.state.data.state))[0];
        }
        if(!selected){
            selected = this.rootStateValues[0];
        }
        let newsState;
        if(this.state.user.role == "isRoot") {
            newsState = this.rootStateValues.map(function(item, i){
                return (<option vlaue={item.key} key={i} >{item.value}</option>);
            });
        }
        else{
            newsState = this.userStateValues.map(function(item, i){
                return (<option vlaue={item.key} key={i} >{item.value}</option>);
            });   
        }
        return (
        	<div className="newsForm">
        		<form>
                    <div>
                        <b>Заголовок</b>
                        <input type="text" value={data.header} name="header" onChange={this.onInputChange}/>
                    </div>
                    <div>
                        <b>Тест новости</b>
                        <textarea name="text" value={data.text} onChange={this.onInputChange}></textarea>
                    </div>
                    <div>
                        <b>Статус новости</b>
                        <select name="state" value={selected.value}  onChange={this.onInputChange}>
                            {
                                newsState
                            }
                        </select>
                    </div>
                    <div>
                        <b>Видео (YouTube)</b>
                        <input type="url" value={data.video} name="video" onChange={this.onInputChange} />
                    </div>
                    <input type="file" ref="selector" onChange={this.onFileSelected} accept=".png, .jpg, .jpeg" />
                    <input id="addImageBtn" type="button" value="Добавить изображение" onClick={this.onAddImageClick} />
                    <div className="imagesContainer">
                    {
                        Array.from(this.state.imgSources).map((image, i) =>{
                            return (<img key={i} src={image} className="preUpload"/>)
                        })
                    }
                    </div>
                    <input type="button" value="Сохранить" onClick={this.onSubmit}/>
                </form>
        	</div>
        );
    }
}