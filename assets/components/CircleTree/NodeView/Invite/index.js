export default class Invite{
    constructor(x, y, personId){
        this.x = x;
        this.y = y;
        this.personId = personId;
        this.form = {};
        this.scale = 1;
        this.dx = 0;
        this.dy = 0;
        this.icon = {};
        this.fill = {};
        this.stroke = {};
        this.prepPaths();
        this.active = false;
    }

    click(){
        if(!this.active){
            this.active = true;
            this.form.setParams((this.x-60)*this.scale+this.dx+200, (this.y+20)*this.scale+this.dy+100, this.personId);
            this.form.activate();
        }
        else{
            this.form.deactivate();
        }        
    }

    setOffset(scale, dx, dy){
        this.scale = scale;
		this.dx = dx;
		this.dy = dy;
    }

    activate(){
        this.active = true;
    }

    deactivate(){
        this.active = false;
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
        this.stroke.moveTo(x-5, y);
		this.stroke.lineTo(x+4, y-5);
		this.stroke.moveTo(x-5, y);
		this.stroke.lineTo(x+4, y+5);
		//
        this.fill.arc(x, y, 10, 0, Math.PI*2);
        this.icon.arc(x+4, y-5, 2, 0, Math.PI*2);
        this.icon.arc(x+4, y+5, 2, 0, Math.PI*2);
        this.icon.moveTo(x-5, y);
        this.icon.arc(x-5, y, 2, 0, Math.PI*2);
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
        gc.fillStyle="#000000";
        gc.fill(this.icon);
		gc.stroke(this.stroke);
    }
}