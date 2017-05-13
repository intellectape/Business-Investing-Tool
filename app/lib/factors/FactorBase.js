import React from 'react';
import {CardHeader, CardText} from 'material-ui/Card';

class FactorBase extends React.Component {
    render() {
        let subtitle, color;
        if(this.props.isRisky != null) {
            subtitle = this.props.isRisky ? "Risk" : "No risk";
            color = this.props.isRisky ? "red" : "green";
        }
        return (
            <div>
                <CardHeader
                    title={this.props.title.toUpperCase()}
                    subtitle={subtitle}
                    subtitleColor={color}
                />
                <CardText>
                    {this.props.children}
                </CardText>
            </div>
        );
    }
}

export default FactorBase;
