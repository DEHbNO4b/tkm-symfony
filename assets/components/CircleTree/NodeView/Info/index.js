export default class Info{
    constructor(x, y, gender, personId, canEdit, changeName, isSpouse=false, showLName=true){
        this.x = x;
        this.y = y;
        this.gender = gender;
        this.personId = personId;
        this.canEdit = canEdit;
        this.changeName = changeName;
        this.isSpouse = isSpouse;
        this.showLName = showLName;
        this.form = {};
        this.scale = 1;
        this.dx = 0;
        this.dy = 0;
        this.fill = {};
        this.stroke = {};
        this.icon = {};
        this.prepPaths();
        this.active = false;
    }


    click(){
        if(!this.form.isActive()){
            this.activate();
        }
        else{
            this.deactivate();
        }        
    }

    setOffset(scale, dx, dy){
        this.scale = scale;
		this.dx = dx;
		this.dy = dy;
    }

    activate(){
        this.form.setParams((this.x-60)*this.scale+this.dx+200, 
                                (this.y-150)*this.scale+this.dy+100, 
                                this.gender,
                                this.personId,
                                this.canEdit,
                                this.changeName,
                                this.isSpouse,
                                this.showLName);
            this.form.activate();
    }

    deactivate(){
        this.form.deactivate();
    
    }

    setForm(form){
        this.form = form;
    }

    prepPaths(){
        let x = this.x;
        let y = this.y;
        this.stroke = new Path2D();
        this.fill = new Path2D();
        this.icon = new Path2D();
		this.stroke.arc(x, y, 10, 0, Math.PI*2);
        //draw share
        this.icon.moveTo(x, y-5);
		this.icon.lineTo(x, y-3);
		this.icon.moveTo(x, y-1);
		this.icon.lineTo(x, y+5);
		//
        this.fill.arc(x, y, 10, 0, Math.PI*2);
    }

    isPointIn(gc, x, y){
		if(gc.isPointInPath(this.stroke, x, y, "nonzero")){
			return true;
		}
		return false;
	}

    draw(gc){
        this.prepPaths();
		gc.fillStyle="#00ff00";
        gc.fill(this.fill);
        gc.stroke(this.stroke);
        let lineWidth = gc.lineWidth;
        gc.lineWidth = 2;
        gc.stroke(this.icon);
        gc.lineWidth = lineWidth;
    }
}