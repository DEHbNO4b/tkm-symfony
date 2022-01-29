import Info from '../Info'

export default class Spouse{

    constructor(id, fname, gender, spouseId, x, y, editable, isDeleted) {
        this.id = id;
        this.name = fname;
        this.gender = gender;
        this.x = x;
        this.y = y;
        this.spouseId = spouseId;
        this.editable = editable;
        this.showLName = (this.gender == "male")?false:true;
        this.nodeColor = (gender == "male")?"#add8e6":"#ffc0cb";
        this.nodeColor = (isDeleted)?"#dddddd":this.nodeColor;
        this.margin = 110;
        this.nodePath = {};
		this.stroke = {};

        this.active = false;
        this.opened = false;

        this.scale = 1;
        this.dx = 0;
        this.dy = 0;
        
        this.form = {};
        this.prepPaths(x, y);
        if(this.id == 0){
            if(editable){
                this.info = new Info(x+this.margin+55, y+55, gender, spouseId, editable, this.changeName, true, this.showLName);
            }
        }
        else{
            this.info = new Info(x+this.margin+55, y+55, gender, id, editable, this.changeName, false, this.showLName);
        }
            
    }

    setForm(form){
        this.form = form;
        if(this.info)
            this.info.setForm(form);
    }

    click(gc, x, y){
        if(this.id != 0 && this.spouseId || this.editable){
            if(this.info && this.info.isPointIn(gc, x, y)){

                this.info.click();
            }
        }
    }

    activate(){
        this.active = true;
    }

    deactivate(){
        this.active = false;
    }


    setOffset(scale, dx, dy){
        this.scale = scale;
		this.dx = dx;
        this.dy = dy;
        if(this.info)
            this.info.setOffset(scale, dx, dy);
    }

    prepPaths(x, y){
		this.nodePath = new Path2D();
		this.stroke = new Path2D();
		this.nodePath.arc(x, y, 50, 0, Math.PI*2);
		this.stroke.arc(x, y, 50, 0, Math.PI*2);
	}

    draw(gc){
        let x = this.x;
        let y = this.y;
        if(this.active){
            x+=this.margin;
        }
        this.prepPaths(x, y);
		gc.fillStyle = this.nodeColor;
		gc.fill(this.nodePath);
        gc.stroke(this.stroke);
        if(this.active){
            let textSize = gc.measureText(this.fname+" "+this.lname);
		gc.clearRect(x-textSize.width/2, y+55, textSize.width, 20);
		gc.beginPath();
		gc.fillStyle="#000000";
		gc.textAlign = "center";
        gc.fillText(this.name, x, y+50+20);
        if(this.info)
            this.info.draw(gc);
        }
    }
    isPointIn(gc, x, y){
        if(gc.isPointInPath(this.nodePath, x, y)
            || (this.info && this.info.isPointIn(gc, x, y))){
            return true;
        }
        return false;
    }
    

}