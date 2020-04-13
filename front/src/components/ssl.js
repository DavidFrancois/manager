import * as React from 'react';
import http from '../services/http';
import Button from './button';

class SSL extends React.Component {

    constructor() {
        super();
        this.state = {
            domains: [],
            specificDomain: null,
            queriedDomain: ''
        };
        this.getDomainStatus = this.getDomainStatus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.domainItem = this.domainItem.bind(this);
        this.specificDomainDisplay = this.specificDomainDisplay.bind(this);
    }

    componentWillMount() {
        http.getCertsStatuses()
            .then(res => this.setState({ ...this.state, domains: res.data }))
            .catch(err => console.error(err));
    }

    render() {
        return (
            <div>
                {this.state.domains.map((d, index) => (
                    this.domainItem(d, index)
                ))}
                <div class="form-group">
                    <label for="specificDomain">Specific Domain</label>
                    <input type="text" onChange={this.handleChange} value={this.state.queriedDomain} class="form-control" name="specificDomain" id="" />
                </div> <br />
                <Button className="btn btn-success" text="Get Status" onClickFunc={this.getDomainStatus} key="getStatus" />
                {this.specificDomainDisplay()}
            </div>
        );
    }

    domainItem = (d, index) => {
        return <div className="card item" style="width: 18rem;">
            <div className="card-body">
                <h5 className="card-title">Domain : {d.domain}</h5>
                <p className="card-text">Validity : {d.valid ? 'Valid' : 'Expired'}</p>
                <p className="card-text">Days remaining : {d.daysRemaining}</p>
                <p className="card-text">From : {d.validFrom}</p>
                <p className="card-text">To : {d.validTo}</p>
            </div>
        </div>
    }

    specificDomainDisplay = () => {
        if (this.state.specificDomain !== null) {
            return <div className="card item" style="width: 18rem">
                <p className="card-text">Validity : {this.state.specificDomain.valid ? 'Valid' : 'Expired'}</p>
                <p className="card-text">Days remaining : {this.state.specificDomain.daysRemaining}</p>
                <p className="card-text">From : {this.state.specificDomain.validFrom}</p>
                <p className="card-text">To : {this.state.specificDomain.validTo}</p>
            </div>
        }
    }

    handleChange = e => {
        this.setState({
            ...this.state,
            queriedDomain: e.target.value
        });
    }

    getDomainStatus = () => {
        this.setState({
            ...this.state,
            specificDomain: null
        })
        http.getDomainStatus(this.state.queriedDomain)
            .then(res => {
                this.setState({
                    ...this.state,
                    specificDomain: res.data
                })
            })
            .catch(err => console.error(err));
    }
}


export default SSL;