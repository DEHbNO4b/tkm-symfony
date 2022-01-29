import MenuItem from "./MenuItem";

export default class Menu{
	constructor(x, y, personId, gender, parents){
		this.opened = false;
		this.stroke = {};
		this.fill = {};
		this.prepPaths(x,y);
		this.form = {};
		this.scale = 1;
		this.dx = 0;
		this.dy = 0;
		this.menuItems = [
							new MenuItem(x, y, "brother", personId),
							new MenuItem(x, y, "sister", personId),
							new MenuItem(x, y, "son", personId),
							new MenuItem(x, y, "daughter", personId)
						];
		if(gender!="male"){
			this.menuItems.push(new MenuItem(x, y, "husband", personId));
		}
		else{
			this.menuItems.push(new MenuItem(x, y, "wife", personId));
		}
		if(parents == null){
			this.menuItems.push(new MenuItem(x, y, "father", personId));
			this.menuItems.push(new MenuItem(x, y, "mother", personId));
		}
		else{
			if(!parents.father){
				this.menuItems.push(new MenuItem(x, y, "father"));
			}
			if(!parents.mother){
				this.menuItems.push(new MenuItem(x, y, "mother"));
			}
		}
		
		
	}

	setOffset(scale, dx, dy){
		this.scale = scale;
		this.dx = dx;
		this.dy = dy;
		for(let i = 0; i<this.menuItems.length; i++){
			this.menuItems[i].setOffset(scale, dx, dy);
		}
	}

	setForm(form){
		this.form = form;
		for(let i = 0; i< this.menuItems.length; i++){
			this.menuItems[i].setForm(form);
		}
	}

	prepPaths(x, y){
		this.stroke = new Path2D();
		this.fill = new Path2D();
		this.stroke.arc(x, y, 10, 0, Math.PI*2);
		//draw +
		this.stroke.moveTo(x, y-5);
		this.stroke.lineTo(x, y+5);
		this.stroke.moveTo(x+5, y);
		this.stroke.lineTo(x-5, y);
		//
		this.fill.arc(x, y, 10, 0, Math.PI*2);
	}

	active(){
		this.opened = true;
	}

	deactivate(){
		for (let i = 0; i<this.menuItems.length; i++){
			this.menuItems[i].deactivate();
		}
		this.opened = false;
	}

	click(gc, x, y){
		let items = false;
		for(let i=0; i<this.menuItems.length && !items; i++){
			if(this.menuItems[i].isPointIn(gc, x, y)){
				items = true;
				this.menuItems[i].click(gc, x, y);
			}
		}
		if(!items){
			if(this.opened){
				this.deactivate();
			}
			else{
				this.active();
			}
		}
	}

	draw(gc, x, y){
		this.prepPaths(x,y);
		gc.fillStyle="#00ff00";
		gc.fill(this.fill);
		gc.stroke(this.stroke);
		if(this.opened){
			for(let i = 0; i<this.menuItems.length; i++){
				this.menuItems[i].draw(gc);
			}
		}
	}

	isPointIn(gc, x, y){
		let item = false;
		if(this.opened){
			for(let i = 0; i<this.menuItems.length; i++){
				if(this.menuItems[i].isPointIn(gc, x, y)){
					item = true;
				}
			}
		}
		if(gc.isPointInPath(this.stroke, x, y, "nonzero") 
			|| item){
			return true;
		}
		return false;
	}
}