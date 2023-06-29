function generateAbbreviation(name) {
    // Supprime les espaces et divise le nom en mots
    const words = name.replace(/\s+/g, ' ').trim().split(' ');
    let abbreviation = '';
    // Parcourt les mots et ajoute les premières lettres à l'abréviation
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.length > 0) {
            abbreviation += word[0].toUpperCase();

            // Sort de la boucle si l'abréviation atteint trois lettres
            if (abbreviation.length === 3) {
                break;
            }
        }
    }
    // Si l'abréviation est inférieure à trois lettres, ajoute des "X" pour la compléter
    while (abbreviation.length < 3) {
        abbreviation += 'X';
    }
    return abbreviation;
}

module.exports = generateAbbreviation;