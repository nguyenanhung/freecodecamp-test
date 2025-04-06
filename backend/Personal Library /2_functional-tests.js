const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    let bookId;

    test('Add a book with title', done => {
        chai.request(server)
            .post('/api/books')
            .send({ title: 'Test Book' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body.title, 'Test Book');
                bookId = res.body._id;
                done();
            });
    });

    test('Add a book without title', done => {
        chai.request(server)
            .post('/api/books')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'missing required field title');
                done();
            });
    });

    test('Get all books', done => {
        chai.request(server)
            .get('/api/books')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.property(res.body[0], '_id');
                assert.property(res.body[0], 'title');
                assert.property(res.body[0], 'commentcount');
                done();
            });
    });

    test('Get a single book', done => {
        chai.request(server)
            .get(`/api/books/${bookId}`)
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body._id, bookId);
                assert.equal(res.body.title, 'Test Book');
                assert.isArray(res.body.comments);
                done();
            });
    });

    test('Get non-existent book', done => {
        chai.request(server)
            .get('/api/books/invalid')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'no book exists');
                done();
            });
    });

    test('Add a comment to a book', done => {
        chai.request(server)
            .post(`/api/books/${bookId}`)
            .send({ comment: 'Great book!' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body._id, bookId);
                assert.include(res.body.comments, 'Great book!');
                done();
            });
    });

    test('Add comment without comment field', done => {
        chai.request(server)
            .post(`/api/books/${bookId}`)
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'missing required field comment');
                done();
            });
    });

    test('Add comment to non-existent book', done => {
        chai.request(server)
            .post('/api/books/invalid')
            .send({ comment: 'Test' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'no book exists');
                done();
            });
    });

    test('Delete a book', done => {
        chai.request(server)
            .delete(`/api/books/${bookId}`)
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'delete successful');
                done();
            });
    });

    test('Delete all books', done => {
        chai.request(server)
            .delete('/api/books')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'complete delete successful');
                done();
            });
    });
});
