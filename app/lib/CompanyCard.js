import React from 'react';
import SelectField from 'material-ui/SelectField';
import Paper from 'material-ui/Paper';
import {CardHeader, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import {Tab, Tabs} from 'material-ui/Tabs';
import StockFactor from './factors/StockFactor';
import NewsSentimentFactor from './factors/NewsSentimentFactor';
import AnnualReportsFactor from './factors/AnnualReportsFactor';


/**
 * A Card that contains risk factor analysis sections for a selected company. A CompanyCard
 * has a selected publically-traded US EVB-related company, and sections with risk factor
 * analysis for either a short-term or a long-term outlook.
 */
class CompanyCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            outlook: "short",
        };
        this._changeTicker = this._changeTicker.bind(this);
        this._changeOutlook = this._changeOutlook.bind(this);
    }

    _changeTicker(event, index, value) {
        this.props.handleSelectionChange(value);
    }

    _changeOutlook(outlook) {
        this.setState({outlook});
    }

    render() {
        let contents;
        if(this.props.companyList.length === 0) {
            contents = <p>No companies to show.</p>
        } else {
            contents = (
                <div>
                    <Dropdown selectedTicker={this.props.selectedTicker} companyList={this.props.companyList} handleTickerChange={this._changeTicker} />
                    <Tabs value={this.state.outlook} onChange={this._changeOutlook}>
                        <Tab label="Short Term" value="short">
                            <StockFactor ticker={this.props.selectedTicker} />
                            <NewsSentimentFactor ticker={this.props.selectedTicker} />
                        </Tab>
                        <Tab label="Long Term" value="long">
                            <AnnualReportsFactor ticker={this.props.selectedTicker} />
                        </Tab>
                    </Tabs>
                </div>
            );
        }
        return (
            <Paper className="companyCard" zDepth={4}>
                <h2>{this.props.title} for {this.props.parent}</h2>
                {contents}
            </Paper>
        );
    }
};

class Dropdown extends React.Component {
    render() {
        const menuItems = this.props.companyList.map(company => {
            return <MenuItem key={company.ticker} value={company.ticker} primaryText={company.name} />;
        });
        return (
            <div className="flex">
                <SelectField style={{flexGrow: 7, alignSelf: "center"}}
                    value={this.props.selectedTicker}
                    onChange={this.props.handleTickerChange}
                    maxHeight={500}>
                        {menuItems}
                    </SelectField>
            </div>
        );
    }
}

export default CompanyCard;
