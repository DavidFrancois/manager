import * as React from 'react';
import http from '../services/http';
import Button from './button';

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
                {this.state.dbsaves.map((k, index) => (
                    <div className="item">
                        <span key={index}>{k}</span>
                        <br />
                    </div>))}
                <span>Delete all but last <input type="number" onChange={this.handleChange} value={this.state.nbKept}></input></span> logs entry.
                <br />
                <Button className={'btn btn-danger item'} text={'Delete'} onClickFunc={this.removeDBSaves} key={'deleteButton'} />
            </div>
        );
    }

    handleChange = e => {
        this.setState({
            ...this.state,
            nbKept: e.target.value
        })
    }

    removeDBSaves = async () => {
        // TODO : handle error notif
        if (this.state.nbKept > this.state.dbsaves.length) return;
        const res = await http.removeDBSaves(this.state.nbKept);
        this.setState({
            dbsaves: res.data,
            nbKept: ''
        });
    }
}


export default DBSaves;
