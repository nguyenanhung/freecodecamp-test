const chai = require('chai');
const assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

const convertHandler = new ConvertHandler();

suite('Unit Tests', function() {
    test('whole number input', () => {
        assert.isNumber(convertHandler.getNum('32L'));
    });

    test('decimal number input', () => {
        assert.isNumber(convertHandler.getNum('3.2L'));
    });

    test('fractional input', () => {
        assert.isNumber(convertHandler.getNum('3/2L'));
    });

    test('fractional input with decimal', () => {
        assert.isNumber(convertHandler.getNum('3.2/4L'));
    });

    test('double fraction error', () => {
        assert.equal(convertHandler.getNum('3/2/3L'), 'invalid number');
    });

    test('default to 1 when no number', () => {
        assert.equal(convertHandler.getNum('L'), 1);
    });

    test('read valid input unit', () => {
        assert.include(['gal', 'L', 'mi', 'km', 'lbs', 'kg'], convertHandler.getUnit('3gal'));
    });

    test('error for invalid unit', () => {
        assert.equal(convertHandler.getUnit('3g'), 'invalid unit');
    });

    test('return unit for valid input', () => {
        assert.equal(convertHandler.getReturnUnit('gal'), 'L');
    });

    test('spelled-out unit', () => {
        assert.equal(convertHandler.spellOutUnit('gal'), 'gallons');
    });

    test('gal to L', () => {
        assert.approximately(convertHandler.convert(1, 'gal'), 3.78541, 0.00001);
    });

    test('L to gal', () => {
        assert.approximately(convertHandler.convert(1, 'L'), 0.26417, 0.00001);
    });

    test('mi to km', () => {
        assert.approximately(convertHandler.convert(1, 'mi'), 1.60934, 0.00001);
    });

    test('km to mi', () => {
        assert.approximately(convertHandler.convert(1, 'km'), 0.62137, 0.00001);
    });

    test('lbs to kg', () => {
        assert.approximately(convertHandler.convert(1, 'lbs'), 0.453592, 0.00001);
    });

    test('kg to lbs', () => {
        assert.approximately(convertHandler.convert(1, 'kg'), 2.20462, 0.00001);
    });
});
