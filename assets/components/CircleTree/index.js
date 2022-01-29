import React from 'react'
import ReactDOM from 'react-dom'
import NodeForm from './NodeForm'
import NodeInvite from './NodeInvite'
import NodeData from './NodeData'
import NodeInfo from './NodeInfo'
import NewsBtn from './NewsBtn'
import './styles.scss'

export default class Tree extends  React.Component {

	constructor(props) {
        super(props);
        this.state = {
            user:{},
            treeId: 0,
            treeData: {},
            subscribed: false,
            rawData: {},
            treeUsers: []
        };
        this.nodes=[];
        this.treeUsers =[];
        this.gc;
        this.zeroPosDelta ={x:0, y:0};
        this.scale = 1;
        this.mouseCoord = {x:0, y:0};
        this.moved = false;
		this.pressed = false;
		this.nodes = [];
        this.lines = [];
        this.nodeData = {};
        this.activeNode = -1;
        this.clearFrom = 0;
        this.clearTo = 0;


        this.onWheel = this.onWheel.bind(this);
        this.onMouseDoun = this.onMouseDoun.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        
        this.prepareData = this.prepareData.bind(this);
        this.fromRaw = this.fromRaw.bind(this);
        this.deleteRestoreNode = this.deleteRestoreNode.bind(this);
        this.onClick = this.onClick.bind(this);
        this.loadData = this.loadData.bind(this);
        this.initTree = this.initTree.bind(this);
        this.draw = this.draw.bind(this);
        this.showDeletedClick = this.showDeletedClick.bind(this);
    }

    loadData(){  
        let rawData = {};
        let treeId = this.props.router.params.id;
        let user = {};
        let treeData = {};
        fetch('/getCurrentUser')
            .then(responce=>responce.json())
            .then(userInf=>{
               user = {
                    id: userInf.userId,
                    lname: userInf.lastname,
                    fname: userInf.fname,
                    phone: userInf.mobileNumber,
                    email: userInf.email
                };
                fetch('/getTree/'+treeId)
                    .then(responce=>responce.json())
                    .then(data=>{
                        treeData = {
                            id: data.id,
                            family: data.family,
                            adminId: data.adminId
                        };
                        fetch('/getTreeData/'+treeId)
                            .then(responce=>responce.json())
                            .then(nodes=>{
                                rawData = nodes;
                                this.setState({
                                    user: user,
                                    treeId: treeId,
                                    treeData: treeData,
                                    rawData: rawData
                                });
                                this.fromRaw();
                            });
                    });
            });
        

    }


    

    fromRaw(){
        this.treeUsers = [];
        this.activeNode = -1;
        this.lines = [];
        this.nodes = [];
        this.nodeData = {};
        let editable = [];
        if(this.state.user){
            editable = this.findEditableIds(this.state.rawData,
                 this.state.user.id);
        }
        this.nodeData = this.prepareData(this.state.rawData, 
            this.state.treeData, 
            this.state.user, 
            editable,
            (this.refs.showDeleted && this.refs.showDeleted.checked));
        this.nodeData.setPosition(500, 1, 150, 150);
        this.nodes = this.nodeData.getViews(null);
        let minX = 0;
        let maxX = 0;
        for(let i = 0; i<this.nodes.length; i++){
            if(minX>this.nodes[i].presetX)minX=this.nodes[i].presetX;
            if(maxX<this.nodes[i].presetX)maxX=this.nodes[i].presetX;
            this.nodes[i].setForm(this.refs.nodeForm);
            this.nodes[i].setInvite(this.refs.nodeInvite);
            this.nodes[i].setInfo(this.refs.nodeInfo);
            this.nodes[i].setDelRest(this.deleteRestoreNode);
        }
        this.clearFrom =minX-200;
        this.clearTo = maxX;
        this.lines = this.nodeData.getLines();
        this.setState({treeUsers:this.treeUsers});
        this.draw();
    }

    prepareData(nodes, treeData, user, editable, showDeleted, isDeleted = false){
        var isAdmin = (user && user.id == treeData.adminId);
        const checkMarriages = function(pers){
            if(pers.marriages && pers.marriages.length !=0){
                return true;
            }
            return false;
        };
        const checkChildren = function(mar){
            if(mar.children && mar.children.length !=0){
                return true;
            }
            return false;
        };
        let deleted = isDeleted;
        if(nodes.is_deleted == "1"){
            deleted = true;
        }
        if(nodes.is_deleted == "1" 
            && !showDeleted){
            return null;
        }

        if(nodes.user_id != 0){
            this.treeUsers.push(parseInt(nodes.user_id));
        }
    

        let marriage = {};
        let children = [];
        let canedit = (isAdmin
            || nodes.user_id == user.id 
            || editable.indexOf(parseInt(nodes.person_id)) != -1);
        if(checkMarriages(nodes)){
                marriage = new NodeData(nodes.marriages[0].spouse.id, 
                    nodes.marriages[0].spouse.name, 
                    (nodes.marriages[0].spouse.class=="man")?"male":"female",
                    this, [], canedit, true, deleted);
            if(checkChildren(nodes.marriages[0])){
                for(let i=0; i<nodes.marriages[0].children.length; i++){
                    let childData = this.prepareData(nodes.marriages[0].children[i],
                                        treeData, 
                                        user, editable, showDeleted, deleted);
                    if(childData != null)
                        children.push(childData);
                        
                }
            }
        }
        
        let node = new NodeData(nodes.person_id,
            nodes.name, 
            (nodes.class=="man")?"male":"female",
            marriage, 
            children,
            canedit, (nodes.user_id != 0), deleted);
        return node;
    }

    findEditableIds(nd, id){
        if(parseInt(nd.user_id) == parseInt(id)){
            return [parseInt(nd.person_id)];
        }
        else if(nd.marriages && nd.marriages.length !=0){
            if(nd.marriages[0].children && nd.marriages[0].children.length !=0){
                for(var i=0; i<nd.marriages[0].children.length; i++){
                    let res = this.findEditableIds(nd.marriages[0].children[i], id);
                    if(res.length != 0){
                        res.push(parseInt(nd.person_id));
                        return res;
                    }
                }
            }
        }
        return [];
    }

    preventDefault(event){
        event.preventDefault()
    }

    componentDidMount(){
        var canvas = this.refs.canvas;
    	var cont = this.refs.canvas_container;
    	var gc = canvas.getContext("2d");
        window.addEventListener("wheel", this.preventDefault, {passive: false});
    	this.gc = gc;
    	gc.canvas.width  = cont.clientWidth;
  		gc.canvas.height = cont.clientHeight;
    	this.initTree();
    }

    deleteRestoreNode(personId, restore=false){
        let context = this;
        let message = "При удалении человека будут удалены так же и его потомки.\n Вы хотите продолжить?";
        if(restore) message = "При восстановлении человека будут восстановлены так же и его потомки.\n Вы хотите продолжить?";
        if(confirm(message)){
            fetch("/deleteRestoreNode/"+personId)
                .then(responce=>responce.json())
                .then(data=>{
                    if(data.done == "ok"){
                        context.initTree();
                    }
                });
        }
    }

    showDeletedClick(){
        this.fromRaw();
        this.draw();
    }

    initTree(){
    	this.loadData();
        this.draw();
    }

    strokeLines(){
        let stroke = new Path2D();
        for(let i = 0; i<this.lines.length; i++){
            stroke.moveTo(this.lines[i].x1, this.lines[i].y1);
            stroke.lineTo(this.lines[i].x1, this.lines[i].y1+5+(Math.abs(this.lines[i].y2-this.lines[i].y1)/2));
            stroke.lineTo(this.lines[i].x2, this.lines[i].y1+5+(Math.abs(this.lines[i].y2-this.lines[i].y1)/2));
            stroke.lineTo(this.lines[i].x2, this.lines[i].y2);
        }
        return stroke;
    }

    draw(){ 
        
        var canvas = this.refs.canvas;
        this.gc.filStyle = "#ffffff";
        this.gc.clearRect(Math.abs(this.clearFrom*2)*(-1), 0, this.clearTo*3, canvas.height*100);//-canvas.width*3, 0, canvas.width*3*3, canvas.height*10);
        this.gc.stroke(this.strokeLines());
        for(let i =0; i<this.nodes.length; i++){
            if(this.activeNode == i) continue;
            this.nodes[i].draw(this.gc);   
        }
        if(this.activeNode != -1){
            this.nodes[this.activeNode].setOffset(this.scale, this.zeroPosDelta.x, this.zeroPosDelta.y);
            this.nodes[this.activeNode].draw(this.gc);
        }
    }

    componentWillUnmount(){
        window.removeEventListener("wheel", this.preventDefault, {passive: false});
    }

    componentDidUpdate(){
        if(this.props.router.params.id != this.state.treeId){
            this.setState({treeId:this.props.router.params.id});
            this.loadData();
        }
        this.draw();
    }

    onWheel(e){
        e = e || window.event;
		var delta = e.deltaY || e.detail || e.wheelDelta;
		let scale;
		if(delta>0){
            scale=0.9;
		}
		else if(delta < 0){
			scale = 1.08;
		}
		else{
            scale=1;
        }
        if(this.scale*scale <=2 && this.scale*scale>=0.5){
            this.scale*=scale;
            this.gc.scale(scale, scale);
            this.dismisActive(e);
            this.draw();
        }

    }


    onClick(e){
        this.dismisActive(e);
        let found = false;
        let x = e.pageX-200; // без вычитания 200 он не работает
        let y = e.pageY-100; // без вычитания 100 он не работает
        
        if(this.moved){
            this.moved = false;
        }
        else{
            for(let i=0; i<this.nodes.length && !found; i++){
                if(this.nodes[i].isPointIn(this.gc, x, y)){
                    found = true;
                    this.nodes[i].activate();
                    this.nodes[i].click(this.gc, x, y);
                    this.activeNode = i;
                    this.draw();
                }
            }
        }
    }

    onMouseLeave(e){
        this.onMouseUp(e);
    }

    onMouseDoun(e){
		this.pressed = true;
		this.mouseCoord.x = e.pageX;
        this.mouseCoord.y = e.pageY;
        this.dismisActive(e);	
    }

    onTouchStart(e){
        let touch = e.touches[0];
        this.pressed = true;
		this.mouseCoord.x = touch.clientX;
        this.mouseCoord.y = touch.clientY;
        this.dismisActive(e);	
    }

    dismisActive(e){
        if(this.activeNode >= 0 && 
            !this.nodes[this.activeNode].isPointIn(this.gc, 
                e.pageX-200, 
                e.pageY-100)){
            this.nodes[this.activeNode].deactivate();
            this.activeNode = -1;
            this.draw();
        }
    }

    onMouseUp(event){
        this.pressed = false;
    }

    onTouchEnd(event){
        this.pressed = false;
        this.onClick(event);
    }


    onMouseMove(e){
    	if(this.pressed){
			let x = e.pageX-this.mouseCoord.x;
			let y = e.pageY-this.mouseCoord.y;
			let needmove = false;
			let hmv = 0;
			let vmv = 0;
			if(Math.abs(x)>5){
				needmove = true;
				hmv=x;
			}

			if(Math.abs(y)>5){
				needmove = true;
				vmv = y;
			}
			if(needmove){
                this.moved = true;
                this.zeroPosDelta.x += hmv*this.scale;
                this.zeroPosDelta.y += vmv*this.scale;
				this.gc.translate(hmv, vmv);
				this.draw();
			}
            this.mouseCoord.x = e.pageX;
            this.mouseCoord.y = e.pageY;    					
		}
		
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }

    onTouchMove(e){
        if(this.pressed){
            let touch = e.changedTouches[0];
			let x = touch.clientX-this.mouseCoord.x;
			let y = touch.clientY-this.mouseCoord.y;
			let needmove = false;
			let hmv = 0;
			let vmv = 0;
			if(Math.abs(x)>10){
				needmove = true;
				hmv=x;
			}

			if(Math.abs(y)>10){
				needmove = true;
				vmv = y;
			}
			if(needmove){
                this.moved = true;
                this.zeroPosDelta.x += hmv*this.scale;
                this.zeroPosDelta.y += vmv*this.scale;
				this.gc.translate(hmv, vmv);
				this.draw();
			}
            this.mouseCoord.x = touch.clientX;
            this.mouseCoord.y = touch.clientY;    					
		}
		
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }

    render(){
        let showDeleted = (<div></div>);
        if(this.state.user && this.state.user.id == this.state.treeData.adminId 
            && this.state.user.id != 0){
            showDeleted = (
                <div className="showDeletedDiv">
                    <input ref="showDeleted" type="checkbox" onChange={this.showDeletedClick}/>
                    <span>Показать удалённые узлы</span>
                </div>)
        }
    	return (
    		<div id="canvas_container" ref="canvas_container">
                <NewsBtn user={this.state.user} 
                    treeData={this.state.treeData} 
                    subscribed={this.state.subscribed}
                    treeUsers={this.state.treeUsers}/>
                {showDeleted}
                <canvas ref="canvas"
    				onWheel={this.onWheel}
    				onClick={this.onClick}
    				onMouseDown={this.onMouseDoun}
    				onMouseUp={this.onMouseUp}
                    onMouseMove={this.onMouseMove}
                    onMouseLeave={this.onMouseLeave}
                    onTouchStart={this.onTouchStart}
                    onTouchEnd={this.onTouchEnd}
                    onTouchMove={this.onTouchMove}
    				>
    			</canvas>
                <NodeForm ref="nodeForm" loadFunc={this.initTree} treeId={this.state.treeData.id} />
                <NodeInvite ref="nodeInvite"/>
                <NodeInfo ref="nodeInfo" treeId={this.state.treeData.id} loadFunc={this.initTree} />
    		</div>
    	);
    }
}