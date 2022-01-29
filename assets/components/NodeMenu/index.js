import React from 'react';
import './styles.scss';
import NodeMenuElement from '../../components/NodeMenuElement';
import NodeForm from '../../components/NodeForm';

export default class NodeMenu extends React.Component {
    //{ name } ({ gender }) ({ parentId }) ({ personId })
    constructor(props){
    	super(props);
    	this.state = {
    		activated: false,
    		formProps: {},
    		formOpened: false
    	};
    	this.activate = this.activate.bind(this);
    	this.deactivate = this.deactivate.bind(this);
    	this.showActivated = this.showActivated.bind(this);
    	this.deselectAll = this.deselectAll.bind(this);
    	this.setForm = this.setForm.bind(this);
    	this.showForm = this.showForm.bind(this);
    }
    
    
    deactivate(){
    	this.setState({
    		activated: false,
    		formOpened: false
    	});
    }
    
    activate(){
    	this.setState({
    		activated: true
    	});
    }
    
    
    deselectAll(){
    	this.refs.father.deactivate();
    	this.refs.mother.deactivate();
    	this.refs.brother.deactivate();
    	this.refs.sister.deactivate();
    	this.refs.husband.deactivate();
    	this.refs.wife.deactivate();
    	this.refs.son.deactivate();
    	this.refs.daughter.deactivate();
    	this.setState({formOpened: false});
    }
    
    setForm(role, position){
    	this.setState({formProps: {
    		personId: this.props.personId,
    		role: role,
    		position: position,
    		treeId: this.props.treeId
    		}
    	});
    	this.setState({formOpened: true});
    }
    
    
    showForm(){
    	if(this.state.formOpened){
    		return (
			<NodeForm loadFunc={this.props.loadFunc} role={ this.state.formProps.role }
				personId={ this.state.formProps.personId }
				position={ this.state.formProps.position } 
				treeId={ this.state.formProps.treeId }
				deactivate={ this.deselectAll }	/>
			);
    	}
    	else return (<div></div>);
    	
    }
    //
    
    showActivated(){
        var hidings = {
            father: this.props.relations.father,
            mother: this.props.relations.mother,
            husband: false,
            wife: false
        };
        if(this.props.relations.spouse || this.props.personId == 0){
            hidings.husband = true;
            hidings.wife= true;
        }
        else{
            if(this.props.gender=="male") hidings.husband = true;
            else hidings.wife = true;
        }
    	return (
				<div className="nodeMenu">
					{ this.showForm() }
					<div className="nodeMenuLeftElements">
						<NodeMenuElement ref="father" role="father" hidings={hidings.father}
							deselectAll={ this.deselectAll } 
							setForm={ this.setForm } />
						<NodeMenuElement ref="brother" role="brother"
							deselectAll={ this.deselectAll } 
							setForm={ this.setForm } />
						<NodeMenuElement ref="sister" role="sister"
							deselectAll={ this.deselectAll } 
							setForm={ this.setForm } />
						<NodeMenuElement ref="son" role="son"
							deselectAll={ this.deselectAll } 
							setForm={ this.setForm } />
						
					</div>
					<div className="plus_button plus_button_active" onClick={ this.deactivate }>
						<b>+</b>
					</div>
					<div className="nodeMenuRightElements">
						<NodeMenuElement ref="mother" role="mother" hidings={hidings.mother}
							deselectAll={ this.deselectAll } 
							setForm={ this.setForm } />
						<NodeMenuElement ref="husband" role="husband" hidings={hidings.husband}
							deselectAll={ this.deselectAll } 
							setForm={ this.setForm } />
						<NodeMenuElement ref="wife" role="wife" hidings={hidings.wife}
							deselectAll={ this.deselectAll } 
							setForm={ this.setForm } />
						<NodeMenuElement ref="daughter" role="daughter"
							deselectAll={ this.deselectAll } 
							setForm={ this.setForm } />
					</div>
				</div>
			);
    }
    
    render() {
    	if(this.state.activated){
    		return this.showActivated();
    	}
    	else{
    		return (
				<div className="plus_button" onClick={ this.activate }>
					+
				</div>
			);
    	}
        
    }
}