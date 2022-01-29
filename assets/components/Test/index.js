import React from 'react';

export default class Test extends React.Component {
    render() {
        return (
            <div>
                <p>класс test</p>
            </div>
        );
    }

    componentDidMount() {
        console.log("test");
    }
}
