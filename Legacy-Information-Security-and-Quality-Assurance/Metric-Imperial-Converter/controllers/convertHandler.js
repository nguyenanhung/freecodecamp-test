function ConvertHandler() {
    this.getNum = function(input) {
        const numReg = /^[\d./]+/;
        let result = input.match(numReg);

        if (!result) return 1;
        result = result[0];

        if (result.match(/\//g)?.length > 1) return "invalid number";
        if (result.includes("/")) {
            const [num, denom] = result.split("/");
            return parseFloat(num) / parseFloat(denom);
        }
        return parseFloat(result);
    };

    this.getUnit = function(input) {
        const unitReg = /[a-z]+$/i;
        const result = input.match(unitReg)?.[0].toLowerCase();

        const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
        if (!result || !validUnits.includes(result)) return "invalid unit";
        return result === 'l' ? 'L' : result;
    };

    this.getReturnUnit = function(initUnit) {
        const unitMap = {
            'gal': 'L',
            'L': 'gal',
            'mi': 'km',
            'km': 'mi',
            'lbs': 'kg',
            'kg': 'lbs'
        };
        return unitMap[initUnit];
    };

    this.spellOutUnit = function(unit) {
        const unitNames = {
            'gal': 'gallons',
            'L': 'liters',
            'mi': 'miles',
            'km': 'kilometers',
            'lbs': 'pounds',
            'kg': 'kilograms'
        };
        return unitNames[unit];
    };

    this.convert = function(initNum, initUnit) {
        const conversions = {
            'gal': 3.78541,
            'L': 1/3.78541,
            'mi': 1.60934,
            'km': 1/1.60934,
            'lbs': 0.453592,
            'kg': 1/0.453592
        };
        return Number((initNum * conversions[initUnit]).toFixed(5));
    };

    this.getString = function(initNum, initUnit, returnNum, returnUnit) {
        return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
    };
}

module.exports = ConvertHandler;
