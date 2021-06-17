// React Imports
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Component Imports
import NavBar from './components/navBar.js';

// Views Imports
import Homepage from './views/homepage.js'
import BetTrackr from './views/betTrackr.js'

// CSS
import './App.css'

class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="header">
                    <NavBar/>
                </div>
                <div className="container">
                    <Switch>
                        <Route path = "/" exact component = {Homepage}/>
                        <Route path = "/bet" exact component = {BetTrackr}/>
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;