import * as React from 'react';
import http from '../services/http'

class DBSaves extends React.Component {

    constructor() {
        super();
        this.state = {
            dbsaves: [],
            nbKept: ''
        };
        this.removeDBSaves = this.removeDBSaves.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        http.getDBSaves()
            .then(res => this.setState({
                dbsaves: res.data,
                nbKept: ''
            }))
            .catch(err => console.error(err));
    }

    render() {
        return (
            <div>
                <ul>
                    {this.state.dbsaves.map((k, index) => (
                        <li>
                            <span key={index}>{k}</span> <br />
                        </li>
                    ))}
                </ul>
                <span>Delete all but last <input type="number" onChange={this.handleChange} value={this.state.nbKept}></input></span> logs entry.
                <button class="btn" onClick={this.removeDBSaves}>
                    Delete <span class="badge badge-primary"></span>
                </button>
            </div>
        );
    }

    handleChange = e => {
        this.setState({
            ...this.state,
            nbKept: e.target.value
        })
    }

    removeDBSaves = () => {
        console.log(`Remove all except last ${this.state.nbKept}`);
        http.removeDBSaves(this.state.nbKept)
            .then(res => this.setState({
                dbsaves: res.data,
                nbKept: ''
            }))
    }
}


export default DBSaves;