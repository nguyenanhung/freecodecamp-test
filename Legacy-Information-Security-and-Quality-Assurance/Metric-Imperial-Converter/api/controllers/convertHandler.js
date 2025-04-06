function ConvertHandler() {
    this.getNum = function(input) {
        const numRegEx = /^[\d./]*/;
        let result = input.match(numRegEx)[0];

        if (!result) return 1;

        if ((result.match(/\//g) || []).length > 1) {
            return 'invalid number';
        }

        try {
            if (result.includes('/')) {
                const [numerator, denominator] = result.split('/');
                return Number(numerator) / Number(denominator);
            }
            return Number(result);
        } catch (e) {
            return 'invalid number';
        }
    };

    this.getUnit = function(input) {
        const unitRegEx = /[a-z]+$/i;
        const result = input.match(unitRegEx);

        if (!result) return 'invalid unit';

        const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
        const unit = result[0].toLowerCase();
        return validUnits.includes(unit) ? (unit === 'l' ? 'L' : unit) : 'invalid unit';
    };

    this.getReturnUnit = function(initUnit) {
        const unitMap = {
            'gal': 'L',
            'l': 'gal',
            'mi': 'km',
            'km': 'mi',
            'lbs': 'kg',
            'kg': 'lbs'
        };
        const lowerInitUnit = initUnit.toLowerCase();
        return unitMap[lowerInitUnit] || 'invalid unit';
    };

    this.spellOutUnit = function(unit) {
        const unitNames = {
            'gal': 'gallons',
            'L': 'liters',
            'l': 'liters',
            'mi': 'miles',
            'km': 'kilometers',
            'lbs': 'pounds',
            'kg': 'kilograms'
        };
        const lowerUnit = unit.toLowerCase();
        return unitNames[unit] || unitNames[lowerUnit] || 'invalid unit';
    };

    this.convert = function(initNum, initUnit) {
        const conversions = {
            'gal': 3.78541,
            'l': 1/3.78541,
            'mi': 1.60934,
            'km': 1/1.60934,
            'lbs': 0.453592,
            'kg': 1/0.453592
        };

        const lowerInitUnit = initUnit.toLowerCase();
        if (typeof initNum !== 'number' || !conversions[lowerInitUnit]) {
            return 'invalid';
        }

        return Number((initNum * conversions[lowerInitUnit]).toFixed(5));
    };

    this.getString = function(initNum, initUnit, returnNum, returnUnit) {
        const normalizedInitUnit = initUnit === 'L' ? 'L' : initUnit.toLowerCase();
        const normalizedReturnUnit = returnUnit === 'L' ? 'L' : returnUnit.toLowerCase();
        return `${initNum} ${this.spellOutUnit(normalizedInitUnit)} converts to ${returnNum} ${this.spellOutUnit(normalizedReturnUnit)}`;
    };
}

module.exports = ConvertHandler;
