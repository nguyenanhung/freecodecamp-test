const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    const project = 'test';
    let issueId;

    test('Create an issue with every field', done => {
        chai.request(server)
            .post(`/api/issues/${project}`)
            .send({
                issue_title: 'Test Issue',
                issue_text: 'This is a test',
                created_by: 'Tester',
                assigned_to: 'Dev',
                status_text: 'In Progress'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body.issue_title, 'Test Issue');
                assert.equal(res.body.issue_text, 'This is a test');
                assert.equal(res.body.created_by, 'Tester');
                assert.equal(res.body.assigned_to, 'Dev');
                assert.equal(res.body.status_text, 'In Progress');
                assert.isTrue(res.body.open);
                issueId = res.body._id;
                done();
            });
    });

    test('Create an issue with only required fields', done => {
        chai.request(server)
            .post(`/api/issues/${project}`)
            .send({
                issue_title: 'Required Only',
                issue_text: 'Minimal test',
                created_by: 'Minimalist'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body.assigned_to, '');
                assert.equal(res.body.status_text, '');
                done();
            });
    });

    test('Create an issue with missing required fields', done => {
        chai.request(server)
            .post(`/api/issues/${project}`)
            .send({ issue_title: 'Missing' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'required field(s) missing' });
                done();
            });
    });

    test('View issues on a project', done => {
        chai.request(server)
            .get(`/api/issues/${project}`)
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.isAtLeast(res.body.length, 1);
                done();
            });
    });

    test('View issues with one filter', done => {
        chai.request(server)
            .get(`/api/issues/${project}?open=true`)
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.isTrue(res.body.every(issue => issue.open === true), 'All issues should be open');
                done();
            });
    });

    test('View issues with multiple filters', done => {
        chai.request(server)
            .get(`/api/issues/${project}?open=true&created_by=Tester`)
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.isTrue(
                    res.body.every(issue => issue.open === true && issue.created_by === 'Tester'),
                    'All issues should be open and created by Tester'
                );
                done();
            });
    });

    test('Update one field on an issue', done => {
        chai.request(server)
            .put(`/api/issues/${project}`)
            .send({ _id: issueId, issue_text: 'Updated text' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { result: 'successfully updated', '_id': issueId });
                done();
            });
    });

    test('Update multiple fields on an issue', done => {
        chai.request(server)
            .put(`/api/issues/${project}`)
            .send({ _id: issueId, issue_text: 'More updates', open: false })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { result: 'successfully updated', '_id': issueId });
                done();
            });
    });

    test('Update an issue with missing _id', done => {
        chai.request(server)
            .put(`/api/issues/${project}`)
            .send({ issue_text: 'No ID' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'missing _id' });
                done();
            });
    });

    test('Update an issue with no fields to update', done => {
        chai.request(server)
            .put(`/api/issues/${project}`)
            .send({ _id: issueId })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'no update field(s) sent', '_id': issueId });
                done();
            });
    });

    test('Update an issue with an invalid _id', done => {
        chai.request(server)
            .put(`/api/issues/${project}`)
            .send({ _id: 'invalid', issue_text: 'Test' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'could not update', '_id': 'invalid' });
                done();
            });
    });

    test('Delete an issue', done => {
        chai.request(server)
            .delete(`/api/issues/${project}`)
            .send({ _id: issueId })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { result: 'successfully deleted', '_id': issueId });
                done();
            });
    });

    test('Delete an issue with an invalid _id', done => {
        chai.request(server)
            .delete(`/api/issues/${project}`)
            .send({ _id: 'invalid' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'could not delete', '_id': 'invalid' });
                done();
            });
    });

    test('Delete an issue with missing _id', done => {
        chai.request(server)
            .delete(`/api/issues/${project}`)
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'missing _id' });
                done();
            });
    });
});
