export default class Delete{
    constructor(x, y, personId, canEdit){
        this.x = x;
        this.y = y;
        this.personId = personId;
        this.canEdit = canEdit;
        this.scale = 1;
        this.dx = 0;
        this.dy = 0;
        this.deleteCallback = ()=>{};
        this.fill = {};
        this.stroke = {};
        this.icon = {};
        this.prepPaths();
        this.active = false;
    }


    click(){
        this.deleteCallback(this.personId);        
    }

    setOffset(scale, dx, dy){
        this.scale = scale;
		this.dx = dx;
		this.dy = dy;
    }

    setCallback(callback){
        this.deleteCallback = callback;
    }

    prepPaths(){
        let x = this.x;
        let y = this.y;
        this.stroke = new Path2D();
        this.fill = new Path2D();
        this.icon = new Path2D();
		this.stroke.arc(x, y, 10, 0, Math.PI*2);
        //draw share
        this.icon.moveTo(x-5, y-5);
		this.icon.lineTo(x+5, y+5);
		this.icon.moveTo(x+5, y-5);
		this.icon.lineTo(x-5, y+5);
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