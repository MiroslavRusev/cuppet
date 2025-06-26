module.exports = {
    multilingualStrings: function (lang) {
        const translations = {
            de: {
                Submit: 'Einreichen',
                Delete: 'Löschen',
                Run: 'Laufen',
                everywhere: 'nachgesehen',
            },
            da: {
                'advanced search': 'avanceret søgning',
            },
            sv: {
                'advanced search': 'avancerat sök',
            },
        };
        // Return all translations for the given language, or undefined if not found
        return translations[lang];
    },
};
