// React Imports
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Component Imports
import NavBar from './components/navBar.js';

// Views Imports
import Homepage from './views/homepage.js'
import BetTrackr from './views/betTrackr.js'
import Games from './views/games.js'

// CSS
import './App.css'

class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="header">
                    <NavBar />
                </div>
                <div className="container">
                    <Switch>
                        <Route path="/" exact component={Homepage} />
                        <Route path="/bet" exact component={BetTrackr} />
                        <Route path="/games" exact component={Games} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;