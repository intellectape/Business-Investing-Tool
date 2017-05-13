import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import SentimentGraphs from './SentimentGraphs';
import RiskDependencyGraph from './RiskDependencyGraph';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <RiskDependencyGraph />
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app-root")
);
