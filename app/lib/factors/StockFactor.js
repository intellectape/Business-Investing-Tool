import React from 'react';
import FactorBase from './FactorBase';
import RiskFactorData from './RiskFactorData';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend} from 'recharts';

class StockFactor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            priceData: [],
            trendData: [],
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
        RiskFactorData.getStockData(newTicker).then(res => {
            const priceData = res[0][0];
            const trendData = res[0][1];
            this.setState({priceData, trendData, mode: "loaded"});
        }).catch(err => {
            console.log("Stocks data fetching failed.");
            console.log(err);
            this.setState({mode: "error"});
        });
    }

    render() {
        const title = this.props.title != null
            ? this.props.title
            : "Stocks";
        const content = this._getContentForCurrentState();
        let isRisky = null;
        if(this.state.mode === "loaded" && this.state.trendData.length > 0) {
            const latest = this.state.trendData[this.state.trendData.length-1];
            isRisky = latest.DIn > latest.DIp && latest.ADX > 20;
        }
        return (
            <FactorBase title={title} isRisky={isRisky}>
                {content}
            </FactorBase>
        );
    }

    _getContentForCurrentState() {
        switch(this.state.mode) {
            case "loading":
                return <p>Crunching data...</p>;
            case "error":
                return <span>No stock data found.</span>;
            case "loaded":
                return this._renderLoaded();
            default:
                return <p>Something went wrong.</p>;
        }
    }

    _renderLoaded() {
        return (
            <div>
                <div>
                    <LineChart width={350} height={200} data={this.state.priceData}>
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line name="Price ($)" type="monotone" dataKey="closeprice" stroke="#ff4081" dot={false} activeDot={{r: 8}} />
                    </LineChart>
                </div>
                <div>
                    <LineChart width={350} height={200} data={this.state.trendData}>
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line name="ADX" type="monotone" dataKey="ADX" stroke="blue" dot={false} />
                        <Line name="DI+" type="monotone" dataKey="DIp" stroke="green" dot={false} />
                        <Line name="DI-" type="monotone" dataKey="DIn" stroke="red" dot={false} />
                    </LineChart>
                </div>
            </div>
        );
    }
}

export default StockFactor;
