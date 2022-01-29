import React from 'react';
import { Link } from 'react-router-dom'
import './styles.scss';

export default class SearchPage extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			query:this.props.match.params.searchString,
			results: []
		};
		this.load = this.load.bind(this);
		this.onSearchClick = this.onSearchClick.bind(this);
	}

	componentDidMount(){
        this.load(this.state.query);
	}

	onSearchClick(){
		var query = this.refs.searchString.value.replace(' ', '_');
		this.load(query);
		this.props.history.push('/search/'+query);
	}


	load(query){
		fetch('/searchQuery/'+query)
            .then(response => response.json())
            .then(data => {
            	console.log(data);
                this.setState({
                    results: data
                });
            });
	}



	render(){


		return(
			<div>
				<div className="search_container">
					<input name="search_string" ref="searchString" placeholder="Фамилия и\или Имя" className="search_string" defaultValue={this.state.query.replace('_', ' ')}/>
					<input type="button" name="search" value="Найти" onClick={this.onSearchClick}/>
					<div className="results_container">
						{this.state.results.map(function(e){
							var link = e.family;
							if(e.gender && e.gender == "female"){
								var chars = "бвгджзклмнпрстфхцчшщ";
								if(chars.search(link[link.length-1])){
									link+='а';
								}
							}
							if(e.name)link +=' '+e.name;
							link+=', ';
							if(e.nationality)link +=e.nationality+", ";
							link+=e.ncount+' узлов, ';
							link+='добавлен '+e.date.split(' ')[0].split('-').reverse().join('.');
							return (<div className="result_element"><Link className="result_element_link" to={'/showTree/'+e.id}>{link}</Link><br /></div>)	
						})}
					</div>
				</div>
			</div>
			);
	}
}