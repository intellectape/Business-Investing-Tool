import React from 'react';
import RiskFactorData from './factors/RiskFactorData';

class SummaryField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stocks: 0,
            news: 0,
            annualReports: 0,
            mode: "loaded", // loading | loaded | error
        };
        this._fetchSummary = this._fetchSummary.bind(this);
    }

    componentWillMount() {
        this._fetchSummary();
        this.setState({mode: "loading"});
    }

    _fetchSummary() {
        RiskFactorData.getSummary(this.props.ticker).then(summary => {
            this.setState(summary);
            this.setState({mode: "loaded"});
            this.props.onFinish();
        }).catch(err => {
            console.log("error fetching summary data.");
            this.setState({mode: "error"});
            this.props.onFinish();
        });
    }

    render() {
        if(this.state.mode === "loading") {
            return <div>Loading...</div>;
        } else if(this.state.mode === "error") {
            return <div>Error querying for summary statement!</div>;
        } else {
            const s = this.state.stocks,
                n = this.state.news,
                ar = this.state.annualReports,
                green = {color: 'green'},
                red = {color: 'red'},
                sStyle = (s === 0) ? green : red,
                nStyle = (n === 0) ? green : red,
                arStyle = (ar === 0) ? green : red;
            return (
                <div className="summary">
                    <p>For {this.props.ticker}, we found
                        <span className="bignumber" style={sStyle}> {s} </span> stock risks,
                        <span className="bignumber" style={nStyle}> {n} </span> news risks, and
                        <span className="bignumber" style={arStyle}> {ar} </span> annual reports risks.
                    </p>
                </div>
            );
        }
    }
}

export default SummaryField;
