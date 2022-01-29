import React from 'react';
import Person from './../Person';

export default class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: []
        };
    }

    componentDidMount() {
        fetch('/getTreeData/1')
            .then(response => response.json())
            .then(entries => {
                this.setState({
                    entries
                });
            });
    }

    render() {
        return (
            <div className="showTree">
                {
                    //if (this.state.entries.length > 0) {
                    // {parentId}, {personId}, {name}, {gender}
                    //<div className="circle">{name}</div>
                        this.state.entries.map(
                            ({ family, persons }) => (
                                <div className="row" key={family}>
                                Фамилия: {family}
                                <br/>
                                persons:
                                {persons.map(
                                    ({parentId, personId, name, gender}) => (
                                        <div className="node" key={personId}>
                                            <Person parentId={ parentId } personId={ personId } name={ name } gender={ gender } />
                                        </div>
                                    )
                                )}
                                </div>
                            )
                        )
                    //}
                }
            </div>
        );
    }
}