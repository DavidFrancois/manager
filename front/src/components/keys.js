import * as React from 'react';
import http from '../services/http';
import Button from './button';

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
                {this.state.keys.map((k, index) => this.itemKey(k, index))}
                <div className="form-group">
                    <label for="newKey"><strong>Type a key</strong></label>
                    <textarea onChange={this.handleChange} value={this.state.inputKey} class="form-control" name="newKey" id="" rows="3"></textarea>
                </div>
                <Button className={'btn btn-primary'} key={'addButton'} onClickFunc={this.addKey} text={'Add Key'}/> <br />
                <Button className={'btn btn-success item'} key={'saveButton'} onClickFunc={this.saveKeys} text={'Save Keys'}/>
            </div>
        );
    }

    itemKey = (k, index) => (
        <div className="item">
            <span key={index}>{k}</span> <br />
            <Button className={'btn btn-danger'} key={`delete_${index}`} onClickFunc={() => this.removeKey(index)} text={'Delete'}/>
        </div>
    )

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

    saveKeys = async () => {
        // TODO: Handle error
        const res = await http.saveKeys({ keys: this.state.keys });
        this.setState({
            ...this.state,
            keys: res.data
        });
    };

}


export default Keys;
