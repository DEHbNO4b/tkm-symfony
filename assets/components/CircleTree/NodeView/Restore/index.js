export default class Restore{
    constructor(x, y, personId, canEdit){
        this.x = x;
        this.y = y;
        this.personId = personId;
        this.canEdit = canEdit;
        this.scale = 1;
        this.dx = 0;
        this.dy = 0;
        this.restoreCallback = ()=>{};
        this.fill = {};
        this.stroke = {};
        this.iconArc = {};
        this.iconArrow = {};
        this.prepPaths();
        this.active = false;
    }


    click(){
        this.restoreCallback(this.personId, true);        
    }

    setOffset(scale, dx, dy){
        this.scale = scale;
		this.dx = dx;
		this.dy = dy;
    }

    setCallback(callback){
        this.restoreCallback = callback;
    }

    prepPaths(){
        let x = this.x;
        let y = this.y;
        this.stroke = new Path2D();
        this.fill = new Path2D();
        this.iconArc = new Path2D();
        this.iconArrow = new Path2D();

		this.stroke.arc(x, y, 10, 0, Math.PI*2);
        //draw share
        this.iconArc.arc(x, y, 5, -90*Math.PI/180, 135*Math.PI/180);
        this.iconArrow.moveTo(x, y-8);
        this.iconArrow.lineTo(x, y-2);
        this.iconArrow.lineTo(x-5, y-5);
        this.iconArrow.lineTo(x, y-8);
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
        gc.fillStyle="#000000";
        gc.stroke(this.iconArc);
        gc.fill(this.iconArrow);
        gc.lineWidth = lineWidth;
    }
}