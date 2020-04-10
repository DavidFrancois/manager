import * as React from 'react';
import http from '../services/http'

class Keys extends React.Component {

    constructor() {
        super();
        this.state = {
            keys: [],
            inputKey: ''
        };
        this.removeKey = this.removeKey.bind(this);
        this.addKey = this.addKey.bind(this);
        this.saveKeys = this.saveKeys.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        http.getKeys()
            .then(res => this.setState({ keys: res.data }))
            .catch(err => console.error(err));
    }

    render() {
        return (
            <div>
                <ul>
                    {this.state.keys.map((k, index) => (
                        <li>
                            <span key={index}>{k}</span> <br />
                            <span key={`delete_${index}`} onClick={() => this.removeKey(index)}>Delete</span>
                        </li>
                    ))}
                    <li>
                        <div class="form-group">
                            <label for="newKey"></label>
                            <textarea onChange={this.handleChange} value={this.state.inputKey} class="form-control" name="" id="" rows="3"></textarea>
                        </div> <br />
                        <button class="btn" onClick={this.addKey}>
                            Add Key <span class="badge badge-primary"></span>
                        </button>
                    </li>
                </ul>

                <button class="btn" onClick={this.saveKeys}>
                    Save Keys <span class="badge badge-primary"></span>
                </button>
            </div>
        );
    }

    removeKey = (index) => {
        if (this.state.keys.length <= 2) {
            console.log(`Handle notif`);
        } else {
            this.setState({
                ...this.state,
                keys: [
                    ...this.state.keys.slice(0, index),
                    ...this.state.keys.slice(index + 1, this.state.keys.length)
                ]
            });
        }
    }

    addKey = () => {
        this.setState({
            keys: [...this.state.keys, this.state.inputKey],
            inputKey: ''
        })
    };

    handleChange = (e) =>
        this.setState({
            ...this.state,
            inputKey: e.target.value
        });

    saveKeys =  async () => {
        // Handle error
        const keys = await http.saveKeys({ keys: this.state.keys }).data;
        this.setState({
            ...this.state,
            keys: keys
        })
    };

}


export default Keys;