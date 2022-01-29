import React from 'react';
import { Link } from 'react-router-dom'

export default class LeftPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: []
        };
    }

    componentDidMount() {
        fetch('/getTrees')
            .then(response => response.json())
            .then(entries => {
                this.setState({
                    entries
                });
            });
    }

    render() {
        return (
            <aside className="sidebar sidebar1">
                <div className="leftPart">
                    {this.state.entries.map(
                        ({ id, family, adminId, dateAdded, lastUpdate }) => (
                            <div className="row" key={id}>
                            <Link to={'/showTree/'+id}>{family}</Link>
                            </div>
                        )
                    )}
                </div>
            </aside>
        )
    }
}
