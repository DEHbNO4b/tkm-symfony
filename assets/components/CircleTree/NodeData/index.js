import NodeView from '../NodeView';
export default class Node{
	constructor(id, name, gender, marriege, children, editable, haveUser, isDeleted){
		this.id=id;
		this.name = name;
		this.gender = gender;
		this.editable = editable;
		this.haveUser = haveUser;
		this.marriege = marriege;
		this.children = children;
		this.isDeleted = isDeleted;
		this.position = {x:0, y:0};
		this.width = this.getWidth();
		this.lines = [];
		this.parents = {}
	}

	checkChildren(){
		if(this.children && this.children.length !=0){
			return true;
		}
		return false;
	}

	setPosition(x, layer, width, height){
		this.position = {x: x, y:layer*height};
		if(this.checkChildren()){
			let curPos = 0-this.width/2+this.children[0].width/2;
			this.children[0].setPosition((x+(curPos*width)), layer+1, width, height);
			this.lines.push({
				x1: this.position.x, 
				y1: this.position.y,
				x2: (x+(curPos*width)),
				y2: (layer+1)*height
			});
			for(let i=1; i<this.children.length; i++){
				curPos+=this.children[i-1].width/2+this.children[i].width/2
				let newX = x+(curPos*width);
				this.children[i].setPosition(newX, layer+1, width, height);
				this.lines.push({
					x1: this.position.x, 
					y1: this.position.y,
					x2: (x+(curPos*width)),
					y2: (layer+1)*height
				});
			}
		}
	}

	getLines(){
		let ret = this.lines;
		if(this.checkChildren()){
			for(let i = 0; i<this.children.length; i++){
				ret = ret.concat(this.children[i].getLines());
			}
		}
		return ret;
	}

	getWidth(){
		let width = 0;
		if(this.checkChildren()){
			for(let i = 0; i<this.children.length; i++){
				width+=this.children[i].getWidth();
			}
		}
		else{
			width = 1;
		}
		return width;
	}

	getViews(parents = null){
		let ret = [];
		let pars = {father: false, mother: false};
		if(this.gender == "male" && this.name !== "Не указано"){
			pars.father = true;
			
		}
		else if(this.name !== "Не указано"){
			pars.mother = true;
			
		}
		if(this.gender == "male"){
			if(this.marriege.name !== "Не указано"){
				pars.mother = true;
			}
		}
		else if(this.marriege.name !== "Не указано"){
			pars.father = true;
		}
		ret.push(new NodeView(this.id, 
			this.name, 
			"", 
			this.gender,
			parents, 
			this.position.x,
			this.position.y,
			this.editable,
			this.haveUser,
			this.marriege,
			this.isDeleted));
		if(this.checkChildren()){
			for(let i = 0; i<this.children.length; i++){
				ret = ret.concat(this.children[i].getViews(pars));
			}
		}

		return ret;
	}
}