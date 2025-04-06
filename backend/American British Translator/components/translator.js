const americanToBritishSpelling = require('./american-to-british-spelling');
const americanToBritishTitles = require('./american-to-british-titles');
const britishToAmericanSpelling = require('./british-to-american-spelling');
const britishToAmericanTitles = require('./british-to-american-titles');

class Translator {
    translate(text, locale) {
        if (!text || text.trim() === '') return { error: 'No text to translate' };
        if (!['american-to-british', 'british-to-american'].includes(locale)) {
            return { error: 'Invalid value for locale field' };
        }

        let translated = text;
        const changes = [];

        // Time format conversion
        const timeRegex = locale === 'american-to-british' ? /(\d+):(\d+)/g : /(\d+)\.(\d+)/g;
        translated = translated.replace(timeRegex, (match, hour, minute) => {
            const newTime = locale === 'american-to-british' ? `${hour}.${minute}` : `${hour}:${minute}`;
            changes.push({ original: match, translated: newTime });
            return `<span class="highlight">${newTime}</span>`;
        });

        // Full title mappings
        const fullTitlesToAbbr = {
            'doctor': { 'american-to-british': 'Dr', 'british-to-american': 'Dr.' },
            'mister': { 'american-to-british': 'Mr', 'british-to-american': 'Mr.' },
            'missus': { 'american-to-british': 'Mrs', 'british-to-american': 'Mrs.' },
            'miss': { 'american-to-british': 'Ms', 'british-to-american': 'Ms.' },
            'mixter': { 'american-to-british': 'Mx', 'british-to-american': 'Mx.' },
            'professor': { 'american-to-british': 'Prof', 'british-to-american': 'Prof.' }
        };

        // Handle full titles
        for (const [full, targets] of Object.entries(fullTitlesToAbbr)) {
            const regexFull = new RegExp(`\\b${full}\\b`, 'gi');
            const targetAbbr = targets[locale];
            if (regexFull.test(translated)) {
                translated = translated.replace(regexFull, match => {
                    const newTitle = match.toLowerCase() === full ? targetAbbr :
                        targetAbbr.charAt(0).toUpperCase() + targetAbbr.slice(1);
                    changes.push({ original: match, translated: newTitle });
                    return `<span class="highlight">${newTitle}</span>`;
                });
            }
        }

        // Handle abbreviated titles from dictionaries
        const titles = locale === 'american-to-british' ? americanToBritishTitles : britishToAmericanTitles;
        for (const [from, to] of Object.entries(titles)) {
            // Match both "Dr" and "Dr." for American-to-British
            const regex = locale === 'american-to-british' ?
                new RegExp(`\\b${from.replace('.', '\\.?')}\\b(?=\\s|$)`, 'gi') :
                new RegExp(`\\b${from}\\b(?=\\s|$)`, 'gi');
            if (regex.test(translated)) {
                translated = translated.replace(regex, match => {
                    const newTitle = match.match(/^[A-Z]/) ?
                        to.charAt(0).toUpperCase() + to.slice(1) : to;
                    changes.push({ original: match, translated: newTitle }); // Always log
                    return `<span class="highlight">${newTitle}</span>`;
                });
            }
        }

        // Spelling and terms conversion
        const dict = locale === 'american-to-british' ? americanToBritishSpelling : britishToAmericanSpelling;
        for (const [from, to] of Object.entries(dict)) {
            const escapedFrom = from.replace('.', '\\.');
            const regex = new RegExp(`\\b${escapedFrom}\\b`, 'gi');
            if (regex.test(translated)) {
                translated = translated.replace(regex, match => {
                    const newWord = match.toLowerCase() === from ? to :
                        to.charAt(0).toUpperCase() + to.slice(1);
                    if (match !== newWord) {
                        changes.push({ original: match, translated: newWord });
                    }
                    return `<span class="highlight">${newWord}</span>`;
                });
            }
        }

        if (changes.length === 0) {
            return { text, translation: "Everything looks good to me!" };
        }

        return { text, translation: translated };
    }
}

module.exports = Translator;
