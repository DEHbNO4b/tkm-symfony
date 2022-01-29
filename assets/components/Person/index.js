import React from 'react';
import './styles.scss'

export default class Person extends React.Component {
    //{ name } ({ gender }) ({ parentId }) ({ personId })
    render() {
        let parentId = this.props.parentId
        let personId = this.props.personId
        let name = this.props.name
        let gender = this.props.gender

        return (
            <div className="person">
                { name }
            </div>
        );
    }
}