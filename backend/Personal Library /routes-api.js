// Mock in-memory store
const books = [];

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = function (app) {
    app.route('/api/books')
        // POST: Add a book
        .post((req, res) => {
            const { title } = req.body;

            if (!title) {
                return res.send('missing required field title');
            }

            const newBook = {
                _id: generateId(),
                title,
                comments: [],
                commentcount: 0
            };

            books.push(newBook);
            res.json({ title, _id: newBook._id });
        })

        // GET: Get all books
        .get((req, res) => {
            res.json(books.map(book => ({
                _id: book._id,
                title: book.title,
                commentcount: book.commentcount
            })));
        })

        // DELETE: Delete all books
        .delete((req, res) => {
            books.length = 0;
            res.send('complete delete successful');
        });

    app.route('/api/books/:id')
        // GET: Get a single book
        .get((req, res) => {
            const book = books.find(b => b._id === req.params.id);
            if (!book) {
                return res.send('no book exists');
            }
            res.json({
                _id: book._id,
                title: book.title,
                comments: book.comments
            });
        })

        // POST: Add a comment to a book
        .post((req, res) => {
            const { comment } = req.body;
            const book = books.find(b => b._id === req.params.id);

            if (!book) {
                return res.send('no book exists');
            }

            if (!comment) {
                return res.send('missing required field comment');
            }

            book.comments.push(comment);
            book.commentcount = book.comments.length;
            res.json({
                _id: book._id,
                title: book.title,
                comments: book.comments
            });
        })

        // DELETE: Delete a single book
        .delete((req, res) => {
            const bookIndex = books.findIndex(b => b._id === req.params.id);
            if (bookIndex === -1) {
                return res.send('no book exists');
            }

            books.splice(bookIndex, 1);
            res.send('delete successful');
        });
};
