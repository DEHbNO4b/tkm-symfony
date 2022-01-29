import React from 'react'

export default class SpouseLine extends React.Component{

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
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(0, 25);
        ctx.lineTo(20, 25);
        if(this.props.children){
            ctx.moveTo(10, 25);
            ctx.lineTo(10, 120);    
        }
        ctx.stroke();
    }


    render(){
        return (<canvas ref="canv" className="spouse_line" width="20" height="50"></canvas>);//
    }
}