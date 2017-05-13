import React from 'react';
import FactorBase from './FactorBase';
import RiskFactorData from './RiskFactorData';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend} from 'recharts';

class AnnualReportsFactor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            annualProfits: [],
            quarterlyProfits: [],
            mode: "loaded", // "loading" | "loaded" | "error"
        };
    }

    componentWillMount() {
        this._fetchNewTickerData(this.props.ticker);
        this.setState({mode: "loading"});
    }

    componentWillReceiveProps(newProps) {
        if(newProps.ticker !== this.props.ticker) {
            this._fetchNewTickerData(newProps.ticker);
            this.setState({mode: "loading"});
        }
    }

    _fetchNewTickerData(newTicker) {
        const annualProfitsPromise = RiskFactorData.getAnnualProfits(newTicker);
        const quarterlyProfitsPromise = RiskFactorData.getQuarterlyProfits(newTicker);

        Promise.all([annualProfitsPromise, quarterlyProfitsPromise]).then(([annualRes, quarterlyRes]) => {
            const annualProfits = annualRes.map((profit, index) => {
                const year = 2013+index;
                return {year, profit};
            });
            const quarterlyProfits = quarterlyRes.map((profit, index) => {
                const quarter = "Q" + (index+1);
                return {quarter, profit};
            });
            this.setState({mode: "loaded", annualProfits, quarterlyProfits});
        }).catch(err => {
            console.log("Annual report data fetching failed.");
            console.log(err);
            this.setState({mode: "error"});
        });
    }

    render() {
        const content = this._getContentForCurrentState();
        let isRisky;
        const ap = this.state.annualProfits;
        const qp = this.state.quarterlyProfits;
        if(this.state.mode === "loaded" && ap.length > 0 && qp.length > 0) {
            // If profits are lower than they were 3 years ago, it's risky.
            isRisky = (ap[ap.length-1].profit < ap[0].profit);
        }
        return (
            <FactorBase title="Annual Reports" isRisky={isRisky}>
                {content}
            </FactorBase>
        );
    }

    _getContentForCurrentState() {
        switch(this.state.mode) {
            case "loading":
                return <p>Loading...</p>;
            case "error":
                return <span>No SEC data for this company, probably because it is not an American company.</span>;
            case "loaded":
                return this._renderLoaded();
            default:
                return <p>Something went wrong.</p>;
        }
    }

    _renderLoaded() {
        const ap = this.state.annualProfits,
            startYear = ap[0].year,
            latestYear = ap[ap.length-1].year;
        return (
            <div>
                <h4><center>Annual Profits from {startYear} to {latestYear}</center></h4>
                <LineChart width={350} height={200} data={ap}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="profit" fill='#8884d8' />
                </LineChart>
                <h4><center>Quarterly Profits from 2016</center></h4>
                <LineChart width={350} height={200} data={this.state.quarterlyProfits}>
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="profit" fill='#8884d8' />
                </LineChart>
            </div>
        );
    }
}

export default AnnualReportsFactor;
