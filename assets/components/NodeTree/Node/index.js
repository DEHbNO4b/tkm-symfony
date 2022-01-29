import React from 'react'
import NodeComponent from './../../../components/Node'

export default class Node{
    constructor(id, name, gender,treeId, loadFunc, role, showInvite, relations, showControls){
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.role = role;
        this.loadFunc = loadFunc;
        this.showControls = showControls;
        this.treeId = treeId;
        this.relations = relations;
        this.showInvite = showInvite;
        this.getWidth = this.getWidth.bind(this);
        this.width = this.getWidth();
        this.render = this.render.bind(this);
        this.view = this.render();
        
    }


    getWidth(){
        return 170;
    }

    render(){
        return (<NodeComponent
             loadFunc={this.loadFunc} 
             relations={this.relations} 
             showInvite={this.showInvite} 
             personId={this.id} 
             personName={this.name} 
             treeId={this.treeId} 
             gender={this.gender} 
             showControls={this.showControls}/ >);//
    }

}