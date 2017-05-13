import React from 'react';
import SelectField from 'material-ui/SelectField';
import Paper from 'material-ui/Paper';
import {CardHeader, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import {Tab, Tabs} from 'material-ui/Tabs';
import StockFactor from './factors/StockFactor';
import NewsSentimentFactor from './factors/NewsSentimentFactor';
import AnnualReportsFactor from './factors/AnnualReportsFactor';


class RawMaterialsCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            outlook: "short",
        };
        this._changeSelectedMaterial = this._changeSelectedMaterial.bind(this);
        this._changeOutlook = this._changeOutlook.bind(this);
    }

    _changeSelectedMaterial(event, index, value) {
        this.props.handleSelectionChange(value);
    }

    _changeOutlook(outlook) {
        this.setState({outlook});
    }

    render() {
        return (
            <Paper className="companyCard" zDepth={4}>
                <h2>{this.props.title} for {this.props.parent}</h2>
                <Dropdown selectedMaterial={this.props.selectedMaterial}
                    materials={this.props.materials}
                    handleChange={this._changeSelectedMaterial} />
                <Tabs value={this.state.outlook} onChange={this._changeOutlook}>
                    <Tab label="Short Term" value="short">
                        <StockFactor ticker={this.props.selectedMaterial} title="Price" />
                        <NewsSentimentFactor ticker={this.props.selectedMaterial} />
                    </Tab>
                    <Tab label="Long Term" value="long">
                        <AnnualReportsFactor ticker={this.props.selectedMaterial} />
                    </Tab>
                </Tabs>
            </Paper>
        );
    }
};

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

class Dropdown extends React.Component {
    render() {
        const menuItems = this.props.materials.map(material => {
            return <MenuItem key={material} value={material} primaryText={capitalize(material)} />;
        });
        return (
            <div className="flex">
                <SelectField style={{flexGrow: 7, alignSelf: "center"}}
                    value={this.props.selectedMaterial}
                    onChange={this.props.handleChange}
                    maxHeight={500}>
                        {menuItems}
                    </SelectField>
            </div>
        );
    }
}

export default RawMaterialsCard;
