import React from 'react'
import SpouseLine from './../SpouseLines'
import Lines from './../Lines'
import Node from './../Node'

export default class Pair{

    constructor(main, spouse, children){
        this.main = main;
        this.spouse = spouse;
        this.children = children;
        this.pair = true;
        this.getWidth = this.getWidth.bind(this);
        this.width = this.getWidth();
        this.prepareChildren = this.prepareChildren.bind(this);
        this.childrenData = this.prepareChildren();
        this.haveChildren = this.haveChildren.bind(this);
        this.haveNoChildren = this.haveNoChildren.bind(this);
        if(children && children.length != 0){
            this.view = this.haveChildren();
        }
        else{
            this.view = this.haveNoChildren();
        }
      
    }

    prepareChildren(){
        var ret = [];
        this.children.forEach(function(child){
            var pair = false;
            if(child.pair) pair = true;
            ret.push({
                "width": child.width,
                "isPair": pair
            });
        });
        return ret;
    }

    getWidth(){
        var pairWidth = 340;
        var childrenWidth = 0;
        if(this.children && this.children.length != 0){
            this.children.forEach(function(child){
                //if(childrenWidth != 0) childrenWidth+=20;
                childrenWidth+=child.getWidth();
            })
        }
        return (pairWidth>childrenWidth)?pairWidth:childrenWidth;
    }   

    haveNoChildren(){
        var width = this.width+"px";
        return (<div>
                    <div className="pair" style={ {"minWidth": width} } >
                        {this.main.view}
                        <SpouseLine />
                        {this.spouse.view}
                    </div>
                </div>);
    }

    haveChildren(){
        var width = this.width+"px";
        return (
            <div>
                <div className="pair" style={ {"minWidth": width} } >
                    {this.main.view}
                    <SpouseLine children={true}/>
                    {this.spouse.view}
                </div>
                    <Lines widthProp={this.width} children = {this.childrenData}/>
                <div className="row">
                    {
                        this.children.map(function(item, i){
                              return (<div key={i} className="node_div">{(item.view)}</div>);
                            })
                    }
                </div>
            </div>);
    }
}