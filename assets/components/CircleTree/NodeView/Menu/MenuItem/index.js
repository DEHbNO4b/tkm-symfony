export default class MenuItem{
	constructor(x, y, role, personId){
		this.x = x;
		this.y = y;
		this.role = role;
		this.fill = {};
		this.stroke = {};
		this.width = 50;
		this.scale = 1;
		this.dx = 0;
		this.dy = 0;
		this.height = 20;
		this.personId = personId;
		this.formStartPos={x:0, y: 0};
		this.preparePaths();
		this.strokeColor = ""
		this.textX = x;
		this.textY = y;
		this.form = {};
		
	}

	setOffset(scale, dx, dy){
		this.scale = scale;
		this.dx = dx;
		this.dy = dy;
	}

	deactivate(){
		this.form.deactivate();
	}

	setForm(form){
		this.form = form;
	}

	preparePaths(){
		this.fill = new Path2D();
		this.stroke = new Path2D();
		switch(this.role){
			case "father": this.drawFather(); break;
			case "mother": this.drawMother(); break;
			case "brother": this.drawBrother(); break;
			case "sister": this.drawSister(); break;
			case "son": this.drawSon(); break;
			case "husband": this.drawHusband(); break;
			case "wife": this.drawWife(); break;
			case "daughter": this.drawDaughter(); break;
		}
	}

	drawFather(){
		let x = this.x-2;
		let y = this.y-27;
		this.formStartPos.x = (this.x-80)*this.scale+this.dx-250;
		this.formStartPos.y = (this.y-50)*this.scale+this.dy-80;
		let w = this.width;
		let h = this.height;
		this.fill.moveTo(x-w, y-h);
		this.fill.lineTo(x-w, y);
		this.fill.lineTo(x, y);
		this.fill.lineTo(x, y-h);
		this.fill.lineTo(x-w, y-h);

		this.textX = x-w/2;
		this.textY = y-h/2;

		this.strokeColor = "#1a89ac";
	}

	drawMother(){
		let x = this.x+2;
		let y = this.y-27;
		this.formStartPos.x = (this.x+70)*this.scale+this.dx;
		this.formStartPos.y = (this.y-50)*this.scale+this.dy-80;
		//this.formStartPos.x = 70;
		//this.formStartPos.y = -50;
		let w = this.width;
		let h = this.height;
		this.fill.moveTo(x, y-h);
		this.fill.lineTo(x, y);
		this.fill.lineTo(x+w, y);
		this.fill.lineTo(x+w, y-h);
		this.fill.lineTo(x, y-h);
		this.textX = x+w/2;
		this.textY = y-h/2;
		this.strokeColor = "#ea6980";

	}

	drawBrother(){
		let x = this.x-20;
		let y = this.y-2;
		this.formStartPos.x = (this.x-90)*this.scale+this.dx-250;
		this.formStartPos.y = (this.y-60)*this.scale+this.dy;
		//this.formStartPos.x = -150;
		//this.formStartPos.y = -50;
		let w = this.width;
		let h = this.height;
		this.fill.moveTo(x-w, y-h);
		this.fill.lineTo(x-w, y);
		this.fill.lineTo(x, y);
		this.fill.lineTo(x, y-h);
		this.fill.lineTo(x-w, y-h);
		this.textX = x-w/2;
		this.textY = y-h/2;
		this.strokeColor = "#1a89ac";
	}

	drawSister(){
		let w = this.width;
		let h = this.height;
		let x = this.x-20;
		let y = this.y+2+h;
		this.formStartPos.x = (this.x-90)*this.scale+this.dx-250;
		this.formStartPos.y = (this.y-30)*this.scale+this.dy;
		/*this.formStartPos.x = -150;
		this.formStartPos.y = 20;*/
		this.fill.moveTo(x-w, y-h);
		this.fill.lineTo(x-w, y);
		this.fill.lineTo(x, y);
		this.fill.lineTo(x, y-h);
		this.fill.lineTo(x-w, y-h);
		this.textX = x-w/2;
		this.textY = y-h/2;
		this.strokeColor = "#ea6980";
	}

	drawSon(){
		let w = this.width;
		let h = this.height;
		let x = this.x-2;
		let y = this.y+27+h;
		this.formStartPos.x = (this.x-80)*this.scale+this.dx-250;
		this.formStartPos.y = (this.y+50)*this.scale+this.dy;
		/*this.formStartPos.x = -150;
		this.formStartPos.y = 20;*/
		this.fill.moveTo(x-w, y-h);
		this.fill.lineTo(x-w, y);
		this.fill.lineTo(x, y);
		this.fill.lineTo(x, y-h);
		this.fill.lineTo(x-w, y-h);
		this.textX = x-w/2;
		this.textY = y-h/2;
		this.strokeColor = "#1a89ac";
	}

	drawHusband(){
		let x = this.x+20;
		let y = this.y-2;
		let w = this.width;
		let h = this.height;
		this.formStartPos.x = (this.x+80)*this.scale+this.dx;
		this.formStartPos.y = (this.y-50)*this.scale+this.dy;
		this.fill.moveTo(x, y-h);
		this.fill.lineTo(x, y);
		this.fill.lineTo(x+w, y);
		this.fill.lineTo(x+w, y-h);
		this.fill.lineTo(x, y-h);
		this.textX = x+w/2;
		this.textY = y-h/2;
		this.strokeColor = "#1a89ac";
	}

	drawWife(){
		let w = this.width;
		let h = this.height;
		let x = this.x+20;
		let y = this.y+2+h;
		this.formStartPos.x = (this.x+80)*this.scale+this.dx;
		this.formStartPos.y = (this.y-30)*this.scale+this.dy;
		this.fill.moveTo(x, y-h);
		this.fill.lineTo(x, y);
		this.fill.lineTo(x+w, y);
		this.fill.lineTo(x+w, y-h);
		this.fill.lineTo(x, y-h);
		this.textX = x+w/2;
		this.textY = y-h/2;
		this.strokeColor = "#ea6980";
	}

	drawDaughter(){
		let w = this.width;
		let h = this.height;
		let x = this.x+2;
		let y = this.y+27+h;
		this.formStartPos.x = (this.x+70)*this.scale+this.dx;
		this.formStartPos.y = (this.y+50)*this.scale+this.dy;
		this.fill.moveTo(x, y-h);
		this.fill.lineTo(x, y);
		this.fill.lineTo(x+w, y);
		this.fill.lineTo(x+w, y-h);
		this.fill.lineTo(x, y-h);
		this.textX = x+w/2;
		this.textY = y-h/2;
		this.strokeColor = "#ea6980";
	}

	click(gc, x, y){
		if(!this.form.isActive()){
			this.form.setParams(this.formStartPos.x+200, this.formStartPos.y+100, this.personId, this.role);
			this.form.activate();
		}
		else{
			this.form.deactivate();
		}
		
	}

	isPointIn(gc, x, y){
		if(gc.isPointInPath(this.fill, x, y, "nonzero")){
			return true;
		}
		return false;
	}

	draw(gc){
		this.preparePaths();
		gc.fillStyle = "#ffffff";
		gc.strokeStyle = this.strokeColor;
		gc.fill(this.fill);
		gc.stroke(this.fill);
		gc.fillStyle="#000000";
		gc.textAlign = "center";
		let text = "";
		switch(this.role){
			case "father": text = "Отец"; break;
			case "mother": text = "Мать"; break;
			case "brother": text = "Брат"; break;
			case "sister": text = "Сестра"; break;
			case "son": text = "Сын"; break;
			case "husband": text = "Муж"; break;
			case "wife": text = "Жена"; break;
			case "daughter": text = "Дочь"; break;
		}
		gc.font = "14px Arial";
		gc.fillText(text, this.textX, this.textY+3);
		gc.strokeStyle = "#000000";
	}
}