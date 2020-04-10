import * as React from 'react';
import http from '../services/http'

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
                <ul>
                    {this.state.domains.map((d, index) => (
                        this.domainItem(d, index)
                    ))}
                    <li>
                        <div class="form-group">
                            <label for="specificDomain">Specific Domain</label>
                            <input type="text" onChange={this.handleChange} value={this.state.queriedDomain} class="form-control" name="specificDomain" id="" />
                        </div> <br />
                        <button class="btn" onClick={this.getDomainStatus}>
                            Get Status<span class="badge badge-primary"></span>
                        </button>
                        {this.specificDomainDisplay()}
                    </li>
                </ul>
            </div>
        );
    }

    domainItem = (d, index) => {
        return <div>
            <span>{d.domain}</span> <br />
            <span>{d.valid ? 'Valid' : 'Expired'}</span> <br />
            <span key={index}>{d.daysRemaining}</span> <br />
            <span>{d.validFrom}</span> <br />
            <span>{d.validTo}</span> <br />
        </div>
    }

    specificDomainDisplay = () => {
        if (this.state.specificDomain !== null) {
            return <div>
                <span>{this.state.specificDomain.valid ? 'Valid' : 'Expired'}</span> <br />
                <span>{this.state.specificDomain.daysRemaining}</span> <br />
                <span>{this.state.specificDomain.validFrom}</span> <br />
                <span>{this.state.specificDomain.validTo}</span>
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