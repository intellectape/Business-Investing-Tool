// A file containing configuration variables.

const companies = [
    {"ticker": "ABAT", "name": "Advanced Battery Technologies, Inc."},
    {"ticker": "AESC", "name": "Aero South Carolina"},
    {"ticker": "ALB", "name": "Albemarle"},
    {"ticker": "ALTI", "name": "Altice N.V."},
    {"ticker": "ALV", "name": "Autoliv", "description": "Autoliv is a Swedish–American company with headquarters in Stockholm, Sweden and Auburn Hills, Michigan that in 1997 sprung from the merger of the Swedish company Autoliv AB and Morton Automotive Safety"},
    {"ticker": "AONE", "name": "B456 Systems Ltd."},
    {"ticker": "AVAV", "name": "AeroVironment, Inc."},
    {"ticker": "AXTA", "name": "Axalta", "description": ""},
    {"ticker": "BOSCHLTD", "name": "Bosch", "description": "Robert Bosch GmbH, or Bosch, is a German multinational engineering and electronics company headquartered in Gerlingen, near Stuttgart, Germany."},
    {"ticker": "CBAK", "name": "CBAK Energy Technology, Inc."},
    {"ticker": "CCGI", "name": "Car Charging Group, Inc."},
    {"ticker": "CEQP", "name": "Inergy, L.P.", "description": "Inergy, L.P. is an American supplier of propane based in Kansas City, Missouri that claims to be the fourth-largest propane retailer in the United States. Serving 800,000 customers in 28 states."},
    {"ticker": "CPS", "name": "Cooper Standard", "description": "Cooper-Standard Automotive Inc., headquartered in Novi, Michigan, is an automotive supplier specializing in the manufacture and marketing of systems and components for the automotive industry"},
    {"ticker": "CPST", "name": "Capstone Turbine Corp"},
    {"ticker": "DAI", "name": "Dailmer AG"},
    {"ticker": "DAN", "name": "Dana Incorporated", "description": "The Dana Incorporated is an American worldwide supplier of drivetrain, sealing, and thermal-management technologies."},
    {"ticker": "DLPH", "name": "Delphi Automotive PLC", "description": "Delphi Automotive PLC is an automotive parts manufacturing company headquartered in Gillingham, Kent, UK. It is one of the world's largest automotive parts manufacturers and has approximately 161,000 employees."},
    {"ticker": "ENS", "name": "EnerSys"},
    {"ticker": "EVSI", "name": "Envision Solar International, Inc."},
    {"ticker": "F", "name": "Ford Motor Company"},
    {"ticker": "GM", "name": "General Motors"},
    {"ticker": "HEV", "name": "Ener1 Inc."},
    {"ticker": "HMC", "name": "Honda Motor Company"},
    {"ticker": "JCI", "name": "Johnson Controls International"},
    {"ticker": "KNDI", "name": "Kandi Technologies Group, Inc."},
    {"ticker": "LACDF", "name": "Lithium Americas"},
    {"ticker": "LEA", "name": "Lear Corporation", "description": "Lear Corporation headquartered in Southfield, Michigan, United States of America, is a Fortune 500 company, engaged in the business of manufacturing and distribution of automotive seating and electrical distribution systems. "},
    {"ticker": "051910.KS", "name": "LG Chem"},
    {"ticker": "MGA", "name": "Magna International", "description": "Magna International Inc. is a Canadian global automotive supplier headquartered in Aurora, Ontario, Canada."},
    {"ticker": "NMKEF", "name": "Nemaska Lithium"},
    {"ticker": "NSANY", "name": "Nissan"},
    {"ticker": "PCRFY", "name": "Panasonic"},
    {"ticker": "PLUG", "name": "Plug Power, Inc."},
    {"ticker": "QTWW", "name": "Quantum Fuel Systems Technologies Worldwide "},
    {"ticker": "SPN", "name": "Superior Energy Services", "description": "Superior Energy Services, Inc. is an oilfield services company. In 2014 it ranked 534 on the Fortune 1000"},
    {"ticker": "SQM", "name": "Sociedad Química y Minera de Chile S.A."},
    {"ticker": "TM", "name": "Toyota Motors"},
    {"ticker": "TSLA", "name": "Tesla Motors"},
    {"ticker": "ULTXF", "name": "Ultra Lithium"},
    {"ticker": "UQM", "name": "UQM Technologies"},
    {"ticker": "VLNC", "name": "Valence Technology"},
    {"ticker": "ZAAP", "name": "Zap"},
];

const carMakers = [
    {"ticker": "TSLA", "model": "Model S"},
    {"ticker": "GM", "model": "Chevy Volt"},
    {"ticker": "F", "model": "Focus Electric"},
    {"ticker": "NSANY", "model": "Leaf"},
];

const oemSuppliers = [
    {"ticker": "TSLA", "oems": ["AVAV", "DAI", "QTWW"]},
    {"ticker": "GM", "oems": ["CCGI"]},
    {"ticker": "F", "oems": ["ALV", "AXTA", "BOSCHLTD", "CPS", "DAN", "DLPH", "CEQP", "LEA", "MGA", "SPN"]},
    {"ticker": "NSANY", "oems": []},
];

const batterySuppliers = [
    {"ticker": "TSLA", "batterySuppliers": ["PCRFY", "051910.KS"]},
    {"ticker": "GM", "batterySuppliers": ["JCI", "051910.KS"]},
    {"ticker": "F", "batterySuppliers": ["051910.KS"]},
    {"ticker": "NSANY", "batterySuppliers": ["AESC"]},
];

const rawMaterials = [
    {"ticker": "PCRFY", "materials": ["ALB", "ENS", "LACDF", "NMKEF", "ULTXF"]},
    {"ticker": "051910.KS", "materials": ["ALB", "ENS", "LACDF", "NMKEF", "ULTXF"]},
    {"ticker": "JCI", "materials": ["ALB", "ENS", "LACDF", "NMKEF", "ULTXF"]},
    {"ticker": "AESC", "materials": ["ALB", "ENS", "LACDF", "NMKEF", "ULTXF"]},
];

/** Adds a custom getter method to list of company objects (first addGetByTicker
 * argument), which returns the company object that the given ticker
 * (__proto__.get argument) identifies. */
function addGetByTicker(list) {
    list.__proto__.get = function(ticker) {
        for(let i = 0; i < this.length; i++) {
            if(this[i].ticker === ticker) {
                return this[i];
            }
        }
        return null;
    };
}

addGetByTicker(companies);
addGetByTicker(carMakers);
addGetByTicker(oemSuppliers);
addGetByTicker(batterySuppliers);
addGetByTicker(rawMaterials);


const getCarMakers = () => {
    return carMakers.map(carMaker => {
        return {
            ticker: carMaker.ticker,
            model: carMaker.model,
            name: companies.get(carMaker.ticker).name,
        };
    });
};

const getOEMsForCarMaker = (carMakerTicker) => {
    const supplierRelation = oemSuppliers.get(carMakerTicker);
    if(!supplierRelation) return [];
    return supplierRelation.oems.map(oemTicker => companies.get(oemTicker));
}

const getBatterySuppliersForCarMaker = (carMakerTicker) => {
    const supplierRelation = batterySuppliers.get(carMakerTicker);
    if(!supplierRelation) return [];
    return supplierRelation.batterySuppliers.map(supplierTicker => companies.get(supplierTicker));
};

const getRawMaterialsForBatterySupplier = (batterySupplierTicker) => {
    const supplierRelation = rawMaterials.get(batterySupplierTicker);
    if(!supplierRelation) return [];
    return supplierRelation.materials.map(materialTicker => companies.get(materialTicker));
};

export default {
    getCarMakers,
    defaultCarMaker: companies.get(carMakers[0].ticker), // Tesla Motors
    getOEMsForCarMaker,
    getBatterySuppliersForCarMaker,
    getRawMaterialsForBatterySupplier,
};
