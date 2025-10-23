// 1. Baza suplementów (przykładowe dane)
const supplements = [
    { name: 'Odżywka białkowa', provides: 'protein', targetGoal: 'muscle-gain' },
    { name: 'Kreatyna', provides: 'creatine', targetGoal: 'muscle-gain' },
    { name: 'Witamina D', provides: 'vitamin-d', generalHealth: true },
    { name: 'Omega-3', provides: 'omega-3', generalHealth: true },
    { name: 'Kompleks witamin', provides: 'multivitamin', generalHealth: true },
    { name: 'Spalacz tłuszczu', provides: 'fat-burner', targetGoal: 'weight-loss' }
];

// 2. Bazowe zapotrzebowanie na składniki (uproszczone wartości do MVP)
const baseRequirements = {
    protein: { // g na kg masy ciała
        'sedentary': 0.8,
        'lightly-active': 1.2,
        'very-active': 1.6
    },
    'vitamin-d': { // IU (jednostki międzynarodowe)
        base: 800
    }
};

// 3. Logika aplikacji
const form = document.getElementById('survey-form');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Zapobiegaj przeładowaniu strony

    // Pobranie danych z formularza
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const activityLevel = document.getElementById('activity-level').value;
    const workouts = parseInt(document.getElementById('workouts').value);
    const goal = document.getElementById('goal').value;

    // Obliczenia
    let proteinNeeds = baseRequirements.protein[activityLevel] * weight;

    // Modyfikator płci
    if (gender === 'male') {
        proteinNeeds *= 1.1; // Mężczyźni mają statystycznie więcej masy mięśniowej
    }

    // Modyfikator wieku
    if (age > 40) {
        proteinNeeds *= 1.05; // Z wiekiem zapotrzebowanie na białko może lekko wzrosnąć
    }

    // Modyfikator treningów
    if (workouts >= 4) {
        proteinNeeds *= 1.1; // Więcej treningów = większe zapotrzebowanie
    }

    // Modyfikator celu
    if (goal === 'muscle-gain') {
        proteinNeeds *= 1.3;
    } else if (goal === 'weight-loss') {
        proteinNeeds *= 1.1;
    }

    // Sugestie suplementów
    let suggestedSupplements = [];
    if (proteinNeeds > 1.5 * weight) { // Jeśli zapotrzebowanie jest wysokie
         const proteinSupplement = supplements.find(s => s.provides === 'protein');
         if(proteinSupplement) suggestedSupplements.push(proteinSupplement);
    }

    // Filtrowanie suplementów na podstawie celu
    const goalSpecificSupps = supplements.filter(s => s.targetGoal === goal);
    suggestedSupplements.push(...goalSpecificSupps);

    // Dodawanie suplementów ogólnego zdrowia
    const generalHealthSupps = supplements.filter(s => s.generalHealth);
    suggestedSupplements.push(...generalHealthSupps);

    // Usunięcie duplikatów
    const uniqueSupplements = [...new Map(suggestedSupplements.map(item => [item['name'], item])).values()];


    // Wyświetlanie wyników
    displayResults(proteinNeeds, uniqueSupplements);
});

function displayResults(protein, supplements) {
    let html = `<h2>Twoje wyniki:</h2>`;
    html += `<p><strong>Szacowane dzienne zapotrzebowanie na białko:</strong> ${protein.toFixed(1)}g</p>`;

    if (supplements.length > 0) {
        html += `<h3>Sugerowane suplementy:</h3>`;
        html += `<ul>`;
        supplements.forEach(sup => {
            html += `<li>${sup.name}</li>`;
        });
        html += `</ul>`;
    } else {
        html += `<p>Na podstawie Twoich odpowiedzi, nie ma konkretnych sugestii suplementów.</p>`;
    }

    resultsDiv.innerHTML = html;
}
