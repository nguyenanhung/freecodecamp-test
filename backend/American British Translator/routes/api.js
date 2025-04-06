const Translator = require('../components/translator.js');
const translator = new Translator();

module.exports = function (app) {
    app.route('/api/translate')
        .post((req, res) => {
            const { text, locale } = req.body;
            if (text === undefined || locale === undefined) {
                return res.json({ error: 'Required field(s) missing' });
            }
            res.json(translator.translate(text, locale));
        });
};
