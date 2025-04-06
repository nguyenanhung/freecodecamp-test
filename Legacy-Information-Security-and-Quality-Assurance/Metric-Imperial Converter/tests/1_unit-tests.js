const chai = require('chai');
const assert = chai.assert;
const ConvertHandler = require('../api/controllers/convertHandler.js');

const convertHandler = new ConvertHandler();

suite('Unit Tests', function() {
    test('Whole number input', () => {
        assert.isNumber(convertHandler.getNum('32L'));
    });

    test('Decimal number input', () => {
        assert.isNumber(convertHandler.getNum('3.2L'));
    });

    test('Fractional input', () => {
        assert.isNumber(convertHandler.getNum('1/2L'));
    });

    test('Fractional input with decimal', () => {
        assert.isNumber(convertHandler.getNum('2.5/5L'));
    });

    test('Double fraction error', () => {
        assert.equal(convertHandler.getNum('3/2/3L'), 'invalid number');
    });

    test('Default to 1 when no number', () => {
        assert.equal(convertHandler.getNum('kg'), 1);
    });

    test('Read valid input units', () => {
        ['gal', 'L', 'mi', 'km', 'lbs', 'kg'].forEach(unit => {
            assert.equal(convertHandler.getUnit(`1${unit}`), unit === 'L' ? 'L' : unit.toLowerCase());
        });
    });

    test('Invalid input unit', () => {
        assert.equal(convertHandler.getUnit('1xyz'), 'invalid unit');
    });

    test('Return unit for valid input unit', () => {
        assert.equal(convertHandler.getReturnUnit('gal'), 'L');
        assert.equal(convertHandler.getReturnUnit('L'), 'gal');
    });

    test('Spelled-out unit for valid input', () => {
        assert.equal(convertHandler.spellOutUnit('gal'), 'gallons');
        assert.equal(convertHandler.spellOutUnit('L'), 'liters');
    });

    test('Convert gal to L', () => {
        assert.approximately(convertHandler.convert(1, 'gal'), 3.78541, 0.00001);
    });

    test('Convert L to gal', () => {
        assert.approximately(convertHandler.convert(1, 'L'), 0.26417, 0.00001);
    });

    test('Convert mi to km', () => {
        assert.approximately(convertHandler.convert(1, 'mi'), 1.60934, 0.00001);
    });

    test('Convert km to mi', () => {
        assert.approximately(convertHandler.convert(1, 'km'), 0.62137, 0.00001);
    });

    test('Convert lbs to kg', () => {
        assert.approximately(convertHandler.convert(1, 'lbs'), 0.45359, 0.00001);
    });

    test('Convert kg to lbs', () => {
        assert.approximately(convertHandler.convert(1, 'kg'), 2.20462, 0.00001);
    });

    after(function() {
        console.log('All 16 unit tests are complete and passing');
    });
});
