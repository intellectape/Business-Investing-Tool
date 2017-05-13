import React from 'react';
import Card from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CompanyCard from './CompanyCard';
import SummaryField from './SummaryField';
import RawMaterialsCard from './RawMaterialsCard';
import config from './config';

class RiskDependencyGraph extends React.Component {

    constructor(props) {
        super(props);

        // First, pick an initial car maker. Then, populate the rest of this.state based
        // on this initial car maker's dependencies.
        const selectedCarMaker = config.defaultCarMaker.ticker;
        const {selectedOEM, selectedBatterySupplier, selectedMaterial}
             = this._chooseDefaultsForCarMaker(selectedCarMaker);

        this.state = {
            selectedCarMaker,
            selectedOEM,
            selectedBatterySupplier,
            selectedMaterial,
            open: true,
        };

        this._changeSelectedCarMaker = this._changeSelectedCarMaker.bind(this);
        this._changeSelectedOEM = this._changeSelectedOEM.bind(this);
        this._changeSelectedBatterySupplier = this._changeSelectedBatterySupplier.bind(this);
        this._changeSelectedMaterial = this._changeSelectedMaterial.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleOpen = this._handleOpen.bind(this);
    }

    // Returns {selectedOEM, selectedBatterySupplier, selectedMaterial} defaults
    // for a given car maker. For any of these 3 properties, if there is no default
    // option to choose, the property is set to the empty string.
    _chooseDefaultsForCarMaker(selectedCarMaker) {
        // First, get lists of companies that `carMaker` is dependent on.
        const oems = config.getOEMsForCarMaker(selectedCarMaker);
        const batterySuppliers = config.getBatterySuppliersForCarMaker(selectedCarMaker);
        const selectedBatterySupplier = batterySuppliers.length > 0
            ? batterySuppliers[0].ticker
            : "";
        const rawMaterials = (batterySuppliers.length > 0)
            ? config.getRawMaterialsForBatterySupplier(selectedBatterySupplier)
            : [];

        // Then, choose defaults for each kind of dependency (OEM, battery
        // supplier, or raw material)
        const selectedMaterial = rawMaterials.length > 0
            ? rawMaterials[0].ticker
            : "";
        const selectedOEM = oems.length > 0 ? oems[0].ticker : "";

        return {selectedOEM, selectedBatterySupplier, selectedMaterial};
    }

    _changeSelectedCarMaker(event, index, value) {
        const {selectedOEM, selectedBatterySupplier, selectedMaterial}
            = this._chooseDefaultsForCarMaker(value);
        this.setState({
            selectedCarMaker: value,
            selectedOEM,
            selectedBatterySupplier,
            selectedMaterial,
        });
    }

    _changeSelectedOEM(oem) {
        this.setState({selectedOEM: oem});
    }

    _changeSelectedBatterySupplier(supplier) {
        // Changing the battery supplier also changes the selected raw material,
        // since raw materials are dependencies of the selected battery supplier.
        const rawMaterials = config.getRawMaterialsForBatterySupplier(supplier);
        const selectedMaterial = rawMaterials.length > 0
            ? rawMaterials[0].ticker
            : "";
        this.setState({selectedBatterySupplier: supplier, selectedMaterial});
    }

    _changeSelectedMaterial(material) {
        this.setState({selectedMaterial: material});
    }

    _handleClose() {
        this.setState({open: false});
    }

    _handleOpen() {
        this.setState({open: true});
    }

    render() {
        // Menu items for the top level dropdown that selects a car maker
        const carMakerMenuItems = config.getCarMakers().map(company => {
            return <MenuItem
                key={company.ticker}
                value={company.ticker}
                primaryText={company.name + " " + company.model}
            />;
        });

        const oems = config.getOEMsForCarMaker(this.state.selectedCarMaker);
        const batterySuppliers = config.getBatterySuppliersForCarMaker(this.state.selectedCarMaker);
        const rawMaterials = config.getRawMaterialsForBatterySupplier(this.state.selectedBatterySupplier);

        const actions = [
            <FlatButton
                label="OK"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this._handleClose}
            />,
        ];
        return (
            <div id="riskDependencyGraph">
                <SelectField value={this.state.selectedCarMaker} onChange={this._changeSelectedCarMaker}>
                    {carMakerMenuItems}
                </SelectField>
                <SummaryField ticker={this.state.selectedCarMaker} onFinish={this._handleClose}/>
                <div style={{display: "flex"}}>
                    <CompanyCard
                        title="Raw Materials"
                        companyList={rawMaterials}
                        selectedTicker={this.state.selectedMaterial}
                        parent={this.state.selectedBatterySupplier}
                        handleSelectionChange={this._changeSelectedMaterial} />
                    <CompanyCard
                        title="Battery suppliers"
                        companyList={batterySuppliers}
                        selectedTicker={this.state.selectedBatterySupplier}
                        parent={this.state.selectedCarMaker}
                        handleSelectionChange={this._changeSelectedBatterySupplier} />
                    <CompanyCard
                        title="OEMs"
                        companyList={oems}
                        selectedTicker={this.state.selectedOEM}
                        parent={this.state.selectedCarMaker}
                        handleSelectionChange={this._changeSelectedOEM}/>
                </div>
                <Dialog
                    title="Please wait"
                    modal={false}
                    open={this.state.open}>
                    <p style={{textAlign: 'center'}}>Finding supply chain risks for {this.state.selectedCarMaker}...</p>
                </Dialog>
            </div>
        );
    }
}

export default RiskDependencyGraph;
