import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from './../../libs/d3js/d3.v5.min'
import lodash from './../../libs/lodash/lodash'
import * as dTree from './../../libs/d3js/dtree/dTree'
import Node from './../../components/NodeTest'
import './styles.scss'

export default class DTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            jsonData: {},
            nodes: {}
        };

        this.prepareNodes = this.prepareNodes.bind(this);
        this.objToString = this.objToString.bind(this);
        this.clickFieldClicked = this.clickFieldClicked.bind(this);
    }

    prepareNodes(nd, id){
        var context = this;
        id++;
        this.state.nodes[""+id]= new Node(nd.person_id, nd.name, nd.class, 1);
        if(nd.marriages && nd.marriages.length !=0){
            id+=2;
            var spouseName = nd.marriages[0].spouse.name;
            var spouseGender = nd.marriages[0].spouse.class;
            this.state.nodes[""+id] =new Node(0, spouseName, spouseGender, 1);
            if(nd.marriages[0].children && nd.marriages[0].children.length !=0){
                nd.marriages[0].children.forEach(function(child){
                    id = context.prepareNodes(child, id);
                })
            }
        }
        return id;
    }
    objToString(obj){
        var XMLS = new XMLSerializer(); 
        return XMLS.serializeToString(obj);
    }

    componentDidMount() {
        fetch('/getTreeData/1')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    treeData: [data],
                    jsonData: data
                });
                
                console.log(this.state.nodes);
            });
    }

    clickFieldClicked(){
        var btns = document.getElementsByClassName("plus_button");
        for(var i=0; i<btns.length; i++){
            btns[i].classList.toggle("plus_button");
        }

        var menus = document.getElementsByClassName("nodeMenu");
        for(var i=0; i<menus.length; i++){
            menus[i].classList.toggle("nodeMenu");
        }

        document.getElementById("click_field").classList.toggle("hidden");
    }

    plusButtonClicked(){
        alert("dasdas");
    }


    render() {
        this.prepareNodes(this.state.jsonData, 0);
        var context = this;
        return (
            <div>
                <div className="d3-graph" >
                    {
                        dTree.dTree.init(this.state.treeData,
                        {
                            target: '.d3-graph',
                            debug: true,
                            height: 800,
                            width: 1800,
                            callbacks: {
                                nodeClick: function(name, extra, id) {
                                    var clicked = document.getElementsByClassName("clicked");
                                    if(clicked && clicked.length != 0 ){
                                        var obj = clicked[0];
                                        var objId = obj.id;
                                        if(objId == "plusButton"+id){
                                            obj.classList.remove("plus_button");
                                            document.getElementById("nodeMenu"+id).classList.toggle("nodeMenu");   
                                        }
                                        else if(objId == "plusButtonActive"+id){
                                            document.getElementById("nodeMenu"+id).classList.toggle("nodeMenu");                                                    
                                        }
                                        else if(objId == "father"+id){
                                            document.getElementById(objId).classList.toggle("active");
                                            document.getElementById("nodeForm"+id).classList.toggle("node_form");
                                            document.getElementById("nodeForm"+id).classList.toggle("top");
                                            document.getElementById("nodeForm"+id).classList.toggle("left");
                                            document.getElementById("nodeForm"+id).classList.toggle("hidden");
                                        }
                                        else if(objId == "mother"+id){
                                            document.getElementById(objId).classList.toggle("active");
                                            document.getElementById("nodeForm"+id).classList.toggle("node_form");
                                            document.getElementById("nodeForm"+id).classList.toggle("top");
                                            document.getElementById("nodeForm"+id).classList.toggle("right");
                                            document.getElementById("nodeForm"+id).classList.toggle("hidden");
                                        }
                                        else if(objId == "brother"+id){
                                            document.getElementById(objId).classList.toggle("active");
                                            document.getElementById("nodeForm"+id).classList.toggle("node_form");
                                            document.getElementById("nodeForm"+id).classList.toggle("top");
                                            document.getElementById("nodeForm"+id).classList.toggle("left");
                                            document.getElementById("nodeForm"+id).classList.toggle("hidden");
                                        }
                                        else if(objId == "sister"+id){
                                            document.getElementById(objId).classList.toggle("active");
                                            document.getElementById("nodeForm"+id).classList.toggle("node_form");
                                            document.getElementById("nodeForm"+id).classList.toggle("bottom");
                                            document.getElementById("nodeForm"+id).classList.toggle("left");
                                            document.getElementById("nodeForm"+id).classList.toggle("hidden");
                                        }
                                        else if(objId == "husband"+id){
                                            document.getElementById(objId).classList.toggle("active");
                                            document.getElementById("nodeForm"+id).classList.toggle("node_form");
                                            document.getElementById("nodeForm"+id).classList.toggle("top");
                                            document.getElementById("nodeForm"+id).classList.toggle("right");
                                            document.getElementById("nodeForm"+id).classList.toggle("hidden");
                                        }
                                        else if(objId == "wife"+id){
                                            document.getElementById(objId).classList.toggle("active");
                                            document.getElementById("nodeForm"+id).classList.toggle("node_form");
                                            document.getElementById("nodeForm"+id).classList.toggle("bttom");
                                            document.getElementById("nodeForm"+id).classList.toggle("right");
                                            document.getElementById("nodeForm"+id).classList.toggle("hidden");
                                        }
                                        else if(objId == "son"+id){
                                            document.getElementById(objId).classList.toggle("active");
                                            document.getElementById("nodeForm"+id).classList.toggle("node_form");
                                            document.getElementById("nodeForm"+id).classList.toggle("bttom");
                                            document.getElementById("nodeForm"+id).classList.toggle("left");
                                            document.getElementById("nodeForm"+id).classList.toggle("hidden");
                                        }
                                        else if(objId == "daughter"+id){
                                            document.getElementById(objId).classList.toggle("active");
                                            document.getElementById("nodeForm"+id).classList.toggle("node_form");
                                            document.getElementById("nodeForm"+id).classList.toggle("bttom");
                                            document.getElementById("nodeForm"+id).classList.toggle("right");
                                            document.getElementById("nodeForm"+id).classList.toggle("hidden");
                                        }

                                        obj.classList.remove("clicked");
                                    }
                                    else{
                                        document.getElementById("plusButton"+id).classList.toggle("plus_button");
                                    }
                                },

                                nodeRenderer: function(name, x, y, height, width, extra, id, nodeClass, textClass, textRenderer){
                                    return "<div>"+                            
                                                "<div class='node "+nodeClass+"'>"+
                                                    "<span>"+
                                                        name +
                                                    "</span>"+
                                                "</div>"+
                                                "<div class ='hidden' id='plusButton"+id+"' onclick='this.classList.add(\"clicked\")'>+</div>"+
                                                "<div class='hidden' id='nodeMenu"+id+"'>"+
                                                    "<div class='nodeMenuLeftElements'>"+
                                                        "<div class='male sided_right' id='father"+id+"' onclick='this.classList.add(\"clicked\")'>Отец</div>"+
                                                        "<div class='male' id='brother"+id+"' onclick='this.classList.add(\"clicked\")'>Брат</div>"+
                                                        "<div class='female' id='sister"+id+"' onclick='this.classList.add(\"clicked\")'>Сестра</div>"+
                                                        "<div class='male sided_right' id='son"+id+"' onclick='this.classList.add(\"clicked\")'>Сын</div>"+
                                                    "</div>"+
                                                    "<div class='plus_button plus_button_active' id='plusButtonActive"+id+"' onclick='this.classList.add(\"clicked\")'><b>+</b></div>"+
                                                    "<div class='nodeMenuRightElements'>"+
                                                        "<div class='female' id='mother"+id+"' onclick='this.classList.add(\"clicked\")'>Мать</div>"+
                                                        "<div class='male sided_right' id='husband"+id+"' onclick='this.classList.add(\"clicked\")'>Муж</div>"+
                                                        "<div class='female sided_right' id='wife"+id+"' onclick='this.classList.add(\"clicked\")'>Жена</div>"+
                                                        "<div class='female' id='daughter"+id+"' onclick='this.classList.add(\"clicked\")'>Дочь</div>"+
                                                    "</div>"+
                                                "</div>"+
                                                "<div class='hidden' id='nodeForm"+id+"'>"+ //{ this.props.position+' node_form' }
                                                    "<form method='POST' action='/addNodeIntoDb'>"+
                                                        "<input type='text' name='name' ref='nameField' placeholder='Имя' />"+
                                                        "<input type='button' value='Отмена' class='cancel' />"+
                                                        "<input type='button' value='Сохранить' class='save' />"+
                                                    "</form>"+
                                                "</div>"+
                                            "</div>";
                                },
                                textRenderer: function(name, extra, textClass) {
                                    if (extra && extra.nickname)
                                        name = name + " (" + extra.nickname + ")";
                                    return "<p align='center' class='" + textClass + "'>" + name + "</p>";
                                }
                            }
                        })
                    }
                </div>
                <div className='hidden click_field' id='click_field' onClick={ this.clickFieldClicked } ></div>
            </div>
        );
    }
}
/*
                
*/