import * as React from 'react';
import Keys from './keys';
import DBSaves from './dbsaves';
import SSL from './ssl';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            active: 'keys'
        }
    }

    render() {
        return (
            <Router>
                <Redirect exact from="/" to="keys" />
                <div>
                    <div class="topnav">
                        <Link onClick={() => this.setState({ active: 'keys' })} className={this.state.active === 'keys' ? 'active' : ''} to="/keys">SSH Keys</Link>
                        <Link onClick={() => this.setState({ active: 'dbsaves' })} className={this.state.active === 'dbsaves' ? 'active' : ''} to="/dbsaves">DB Saves</Link>
                        <Link onClick={() => this.setState({ active: 'ssl' })} className={this.state.active === 'ssl' ? 'active' : ''} to="/ssl">SSL</Link>
                    </div>
                    <div className="content">
                        <Switch>
                            <Route path="/keys">
                                <Keys />
                            </Route>
                            <Route path="/dbsaves">
                                <DBSaves />
                            </Route>
                            <Route path="/ssl">
                                <SSL />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>
        )
    }
}

export default Home;