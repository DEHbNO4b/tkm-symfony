import React from 'react'
import './styles.scss'
import NodeMenu from '../../components/NodeMenu'
import NodeInvite from '../../components/NodeInvite'
import NodeInfo from '../../components/NodeInfo'

export default class Node extends React.Component {
    //{ personName } ({ gender }) ({treeId}) ({ personId }) ({userId})
    constructor(props){
    	super(props);
    	this.state = {
    		activated: false,
    		menuActivated: false,
    		editMode: false,
            name: ""
    	};
    	this.click = this.click.bind(this);
    	this.deactivate = this.deactivate.bind(this);
        this.loadFunc = this.loadFunc.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.renderName = this.renderName.bind(this);
        this.changeName = this.changeName.bind(this);
    }

    componentDidMount(){
        this.setState({
            name: this.props.personName
        });
    }

    changeName(newName){
        this.setState({name:newName});
    }
    
    deactivate(){
        if(this.state.editMode){
            if(this.refs.nameEdit && this.refs.nameEdit.value != this.state.name && this.refs.nameEdit.value.length >=2){
                fetch('/editPersonName', {
                    method: 'post',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        "name": this.refs.nameEdit.value,
                        "personId": this.props.personId
                    })  
                })
                .then((response) => response.json())
                .then(responseData => {
                    if (responseData.status === 'ok') {
                        this.setState({
                            name: responseData.name
                        });
                    } else {
                    
                    }
                }).catch(error => {
                    console.log('handle throw error');
                });
            }
            this.setState({
                activated: false,
                editMode: false
            });
        }
        else 
            this.setState({activated: false});
    }
    
    click(){
        var context = this;
        if (this.state.timer) clearTimeout(this.state.timer);
        this.setState({
            timer : setTimeout(function() { 
                context.setState({
                    activated: true
                    }); 
            }, 200)
        });
		
    }

    loadFunc(){
        this.deactivate();
        this.props.loadFunc();
    }

    onDoubleClick(){
        clearTimeout(this.state.timer);
        this.setState({
            activated: true, 
            editMode: true
        });
    }

    renderName(){
        var name = this.state.name;
        var showControls = this.props.showControls;
        if(this.state.editMode && showControls==true){
            return (<input ref="nameEdit" className="nodeInput" name="nameEdit" defaultValue={name} />);
        }
        else{
            return (this.state.name);
        }
    }

    
    render() {
    	var personId = this.props.personId;
    	var treeId = this.props.treeId;
        var showControls = this.props.showControls;
        var name = this.renderName();
        var gender = this.props.gender;
        var classNameValue = "node";
        var nodeInvite = (personId != 0 && this.props.showInvite)?<NodeInvite personId={this.props.personId} />:"";
        classNameValue+= ((gender=="male")?" male":" female");
        if(this.state.activated && showControls===false){
            return (
                <div>
                    <div className="click_field" onClick={ this.deactivate }>
                    </div>                             
                    <div className={ classNameValue } >
                        <span className="clicked_span">
                            { name }
                        </span>
                        <NodeInfo gender={gender} personId={personId} canEdit={false}/>    
                    </div>
                </div>
            );
        }
        else if(this.state.activated && showControls===true)
        {
			return (
				<div>
					<div className="click_field" onClick={ this.deactivate }>
					</div>                             
					<div className={ classNameValue } >
                        {nodeInvite}
						<span className="clicked_span">
							{ name }
						</span>
						<NodeMenu loadFunc={this.loadFunc} relations={this.props.relations} personId={ personId } ref="nodeMenu" gender={ gender } treeId={ treeId } />		
                        <NodeInfo gender={gender} personId={personId} canEdit={true} changeName={this.changeName} />    
					</div>
				</div>
			);
		}
		else{
			return (
				<div className={ classNameValue } onDoubleClick={this.onDoubleClick} onClick={this.click}>
						<span>
							{ name }
						</span>		
					</div>
				);
		}
    }
}