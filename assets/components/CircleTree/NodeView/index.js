import Menu from "./Menu"
import Invite from "./Invite"
import Info from "./Info"
import Spouse from './Spouse'
import Delete from "./Delete";
import Restore from "./Restore";

export default class NodeView{
	constructor(id, fname, lname, gender, parents, x, y, editable, haveUser, spouse, isDeleted) {
		this.id = id;
		this.presetX = x;
		this.presetY = y;
		this.fname = fname;
		this.lname = lname;
		this.gender = gender;
		this.editable = editable;
		this.haveUser = haveUser;
		this.isDeleted = isDeleted;
		this.active = false;
		this.menuOpen = false;
		this.inviteOpen = false;
		this.scale = 1;
		this.dx = 0;
		this.dy = 0;
		this.infoOpen = false;
		this.nodeColor = (gender == "male")?"#add8e6":"#ffc0cb";
		this.nodeColor = (isDeleted == "1")?"#dddddd":this.nodeColor;
		this.nodePath = {};
		this.stroke = {};
		this.changeName = this.changeName.bind(this);
		this.menu = new Menu(x+55, y-55, id, gender, parents);
		this.invite = new Invite(x-55, y+55, id);
		this.delRest = (isDeleted)?new Restore(x-55, y-55, id, editable):new Delete(x-55, y-55, id, editable);
		this.info = new Info(x+55, y+55, gender, id, editable, this.changeName);
		if(spouse.name && spouse.name !== "")
			this.spouse = new Spouse(spouse.id, spouse.name, spouse.gender, id, x+10, y, editable, isDeleted);
		this.prepPaths(x, y);
		this.form = {};

	}

	setOffset(scale, dx, dy){
		this.scale = scale;
		this.dx = dx;
		this.dy = dy;
		this.menu.setOffset(scale, dx, dy);
		this.invite.setOffset(scale, dx, dy);
		this.info.setOffset(scale, dx, dy);
		if(this.spouse){
			this.spouse.setOffset(scale, dx, dy);
		}
	}

	changeName(newName){
		this.fname = newName;
	}

	activate(){
		this.active = true;
		if(this.spouse){
			this.spouse.activate();
		}
	}
	deactivate(){
		this.active = false;
		this.menu.deactivate();
		this.invite.deactivate();
		this.info.deactivate();
		if(this.spouse){
			this.spouse.deactivate();
		}
	}

	prepPaths(x, y){
		this.nodePath = new Path2D();
		this.stroke = new Path2D();
		this.nodePath.arc(x, y, 50, 0, Math.PI*2);
		this.stroke.arc(x, y, 50, 0, Math.PI*2);
	}

	click(gc, x, y){
		if(this.editable){
			if(this.menu.isPointIn(gc, x, y)){
				this.menu.click(gc, x, y);
			}
			if(this.invite.isPointIn(gc, x, y)){
				this.invite.click();
			}
			if(this.delRest.isPointIn(gc, x, y)){
				this.delRest.click();
			}
		}
		if(this.info.isPointIn(gc, x, y)){
			this.info.click();
		}
		if(this.spouse && this.spouse.isPointIn(gc, x, y)){
			this.spouse.click(gc, x, y);
		}
	}

	setForm(form){
		this.form = form;
		this.menu.setForm(form);
	}

	setInvite(form){
		this.inviteForm = form;
		this.invite.setForm(form);
	}

	setInfo(form){
		this.infoForm = form;
		this.info.setForm(form);
		if(this.spouse)
			this.spouse.setForm(form);
	}

	setDelRest(callback){
		this.delRest.setCallback(callback);
	}

	draw(gc){
		let x = this.presetX;
		let y = this.presetY;
		if(this.spouse)
			this.spouse.draw(gc);
		gc.fillStyle = this.nodeColor;
		gc.fill(this.nodePath);
		gc.stroke(this.stroke);
		gc.font = "20px Arial";
		let textSize = gc.measureText(this.fname+" "+this.lname);
		gc.clearRect(x-textSize.width/2, y+55, textSize.width, 20);
		gc.beginPath();
		gc.fillStyle="#000000";
		gc.textAlign = "center";
		gc.fillText(this.fname+" "+this.lname, x, y+50+20);
		
		if(this.active && this.editable) {
			this.menu.draw(gc, x+55, y-55);
			if(!this.haveUser){
				this.invite.draw(gc);
			}
			this.delRest.draw(gc);
		}
		if(this.active){
			this.info.draw(gc);
		}
	}

	isPointIn(gc, x, y){
		if(gc.isPointInPath(this.nodePath, x, y)
			|| (this.editable && (this.menu.isPointIn(gc, x, y) || this.invite.isPointIn(gc, x, y)))
			|| this.info.isPointIn(gc, x, y) || (this.spouse && this.spouse.isPointIn(gc, x, y)
			|| this.delRest.isPointIn(gc, x, y))){
			return true;
		}
		return false;
	}
}