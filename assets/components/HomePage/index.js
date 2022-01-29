import React from 'react';
import NewTreeForm from './../../components/NewTreeForm'
import NodeTree from './../../components/NodeTree'
import { Route } from 'react-router-dom'


export default class HomePage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            treesExist: false,
            treeId: 0,
            logined: false
        };
    }

    componentDidMount(){
        fetch('/getUserTrees')
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                if(data.result === "ok"){
                    this.setState({logined: true});
                    if(data.tree !== 0){
                        console.log("a");
                        //this.setState({treesExist:true, treeId:data.tree});
                        this.props.history.push('/showTree/'+data.tree);
                    }
                    else{
                        //this.setState({treesExist: false});
                        console.log("b");
                    }
                }
                else{
                    this.setState({logined: false});
                    console.log("c");
                }
            });
    }

    render() {
        if(!this.state.logined){
            <Route pathname="/showTree/{this.state.treeId}"/>
            return (<div></div>)
        }
        if(!this.state.treesExist){
            console.log("e");
            return (
                <Route component={ NewTreeForm } />
            );
            //return (<p>no</p>);
            //
        }
        else{
            return (
                <Route pathname="/showTree/{this.state.treeId}"/>
            )
            //return (<p>yes</p>);  
        }
        
    }
}