import React from 'react'

export default class Lines extends React.Component{

    constructor(props){
        super(props);
        this.updateCanvas = this.updateCanvas.bind(this);
    }

    componentDidMount() {
        this.updateCanvas();
    }
    componentDidUpdate() {
        this.updateCanvas();
    }
    updateCanvas() {

        const ctx = this.refs.canv.getContext('2d');
        var children  = this.props.children;
        var sumWidth = 0;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.props.widthProp/2, 0);
        ctx.lineTo(this.props.widthProp/2, 80);
        var context = this;
        children.forEach(function(child){
            var xPos = (child.isPair)?(sumWidth+child.width/2-85):(sumWidth+child.width/2);
            ctx.lineTo(xPos, 80);
            ctx.lineTo(xPos, 150);
            ctx.moveTo(context.props.widthProp/2, 80);
            sumWidth+=child.width;
        });
        
        ctx.stroke();
    }


    render(){
        return (<canvas className="horisontal_line" ref="canv" width={this.props.widthProp}></canvas>);//
    }
}
