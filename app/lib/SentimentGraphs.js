import React, {Component} from 'react';
import {PieChart} from './PieChart';

class SentimentGraphs extends React.Component {
    render() {
        return (
            <div id="chart">
            {/* <PieChart width={300} height={300} />*/}
                <p>Pie chart</p>
            </div>
        );
    }
}

export default SentimentGraphs;
