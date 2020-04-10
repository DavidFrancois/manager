import * as React from 'react';
import Keys from './keys';
import DBSaves from './dbsaves';
import SSL from './ssl';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

class Home extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/keys">SSH Keys</Link>
                            </li>
                            <li>
                                <Link to="/dbsaves">DB Saves</Link>
                            </li>
                            <li>
                                <Link to="/ssl">SSL</Link>
                            </li>
                        </ul>
                    </nav>

                        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
                            {/* <Route path="/">
                            <Home />
                        </Route> */}
                        </Switch>
                </div>
            </Router>
        )
    }
}

export default Home;