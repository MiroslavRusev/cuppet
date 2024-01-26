module.exports = {
    multilingualStrings: function (lang, property) {
        const translations = {
            "fr" : {
                "Submit": "Soumettre",
                "Delete": "Supprimer",
                "Run": "Courir",

                },
            "de" : {
                "Submit": "Einreichen",
                "Delete": "Löschen",
                "Run": "Laufen",

            }
        }
        return translations[lang][property];
    }
};