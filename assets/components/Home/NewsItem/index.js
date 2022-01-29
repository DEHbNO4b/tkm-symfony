import React from 'react';
import './styles.scss';
import NavLink from '../../../components/NavLink'
import YouTube from 'react-youtube';

export default class NewsItem extends React.Component
{
	// props {news_object} user_id  onEditClickCallback
	constructor(props){
		super(props);
		this.state = {
			active: false,
			news: {},
			userId: 0
		};
		this.renderShort = this.renderShort.bind(this);
		this.renderFull = this.renderFull.bind(this);
		this.openNews = this.openNews.bind(this);
		this.closeNews = this.closeNews.bind(this);
	}


	openNews(){
		this.setState({
			active: true
		});
	}

	closeNews(e){
		e.stopPropagation();
  		e.nativeEvent.stopImmediatePropagation();
		this.setState({
			active: false
		});
	}




	renderShort(){
		let news = this.props.news;
		let editLink = ((news.userId == ""+this.props.userId)?(<NavLink to={"/news/edit/"+news.id}>Изменить</NavLink>):(<div></div>));
		let image = (<div></div>)
		if(news.image && news.image != ""){
			image = <img className="short" src={"/news/image/"+news.image} />
		}
		return (
                <div className="newsItem short" onClick={this.openNews}>
                    <div className="imageBlock">
                        {image}
                    </div>
                    <div className="infoBox">
                    	<div className="newsHeaderBox">
	                		<b>{news.header+((news.status == "0")?"-черновик":"")}</b>
		                	<div className="newsEditBtn">
		                    	{editLink}
		                    </div>
	                	</div>
                        <p>{news.text.substring(0, 255)}</p>
                    </div>
                </div>
        );
	}

	renderFull(){
		let news = this.props.news;
		let editLink = ((news.userId == ""+this.props.userId)?(<NavLink to={"/news/edit/"+news.id}>Изменить</NavLink>):(<div></div>));
		let video = (<div></div>);
		let image = (<div></div>)
		if(news.image && news.image != ""){
			image = <img className="full" src={"/news/image/"+news.image} />
		}
		if(news.video && news.video.length != ""){
			let videoUrlSplit = news.video.split("=");
			let videoCode = videoUrlSplit[videoUrlSplit.length-1];
			video = (<YouTube videoId={videoCode} onReady={this._onReady} />);
		}
		return (
                <div className="newsItem full" >
                	
                    <div className="infoBox">
	                    <div className="newsHeaderBox">
	                		<b>{news.header}</b>
		                	<div className="newsEditBtn">
		                		<span className="hideNewsButton" onClick={this.closeNews} >Свернуть</span>
		                    	&nbsp; &nbsp;
								{editLink}
		                    </div>
	                	</div>
                        <p>{news.text}</p>
                    </div>
                    <div className="imageBlock">
                    	{video}
                    	{image}
                        <span className="hideNewsButton" onClick={this.closeNews}>Свернуть</span>
                    </div>
                    
                </div>
        );
	}

	/*
	mL_2Yri1sXs

	
	*/

	render(){
		if(this.state.active){
			return this.renderFull();
		}
		else{
			return this.renderShort();
		}
	}

}