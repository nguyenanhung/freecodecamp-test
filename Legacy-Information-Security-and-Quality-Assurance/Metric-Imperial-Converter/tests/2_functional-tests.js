const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const app = require('../server'); // Changed from 'server' to 'app'

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);

    test('convert valid input', (done) => {
        chai.request(app)
            .get('/api/convert')
            .query({ input: '10L' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'initNum');
                assert.property(res.body, 'initUnit');
                assert.property(res.body, 'returnNum');
                assert.property(res.body, 'returnUnit');
                assert.property(res.body, 'string');
                done();
            });
    });

    test('convert invalid unit', (done) => {
        chai.request(app)
            .get('/api/convert')
            .query({ input: '32g' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'invalid unit');
                done();
            });
    });

    test('convert invalid number', (done) => {
        chai.request(app)
            .get('/api/convert')
            .query({ input: '3/7.2/4kg' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'invalid number');
                done();
            });
    });

    test('convert invalid number and unit', (done) => {
        chai.request(app)
            .get('/api/convert')
            .query({ input: '3/7.2/4kilomegagram' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'invalid number and unit');
                done();
            });
    });

    test('convert with no number', (done) => {
        chai.request(app)
            .get('/api/convert')
            .query({ input: 'kg' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.initNum, 1);
                assert.equal(res.body.initUnit, 'kg');
                done();
            });
    });
});
