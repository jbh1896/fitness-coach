const tabButtons = document.querySelectorAll('.tab-btn');
const tabs = document.querySelectorAll('.tab');

// TABS
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {

    tabButtons.forEach(b => b.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));

    btn.classList.add('active');

    document
      .getElementById(btn.dataset.tab)
      .classList.add('active');
  });
});

// DATEN LADEN
let trainings = JSON.parse(localStorage.getItem('trainings')) || [];
let meals = JSON.parse(localStorage.getItem('meals')) || [];

// TRAINING
document
  .getElementById('trainingForm')
  .addEventListener('submit', e => {

    e.preventDefault();

    const exercise = document.getElementById('exercise').value;
    const weight = Number(document.getElementById('weight').value);
    const reps = Number(document.getElementById('reps').value);
    const sets = Number(document.getElementById('sets').value);

    const tonnage = weight * reps * sets;

    const entry = {
      exercise,
      weight,
      reps,
      sets,
      tonnage
    };

    trainings.push(entry);

    localStorage.setItem(
      'trainings',
      JSON.stringify(trainings)
    );

    document.getElementById('trainingOutput').innerHTML = `
      <div class="output">
        ✅ Gespeichert!<br>
        Tonnage: ${tonnage}kg
      </div>
    `;

    e.target.reset();
  });

// FOOD
document
  .getElementById('foodForm')
  .addEventListener('submit', e => {

    e.preventDefault();

    const meal = document.getElementById('meal').value;
    const protein = Number(document.getElementById('protein').value);
    const calories = Number(document.getElementById('calories').value);

    const entry = {
      meal,
      protein,
      calories
    };

    meals.push(entry);

    localStorage.setItem(
      'meals',
      JSON.stringify(meals)
    );

    document.getElementById('foodOutput').innerHTML = `
      <div class="output">
        ✅ Mahlzeit gespeichert!
      </div>
    `;

    e.target.reset();
  });

// STATS
document
  .getElementById('loadStats')
  .addEventListener('click', () => {

    const totalTonnage = trainings.reduce(
      (sum, t) => sum + t.tonnage,
      0
    );

    const totalProtein = meals.reduce(
      (sum, m) => sum + m.protein,
      0
    );

    document.getElementById('statsOutput').innerHTML = `
      <div class="output">
        <h3>📊 Deine Stats</h3>

        <p>Trainings: ${trainings.length}</p>

        <p>Gesamt-Tonnage: ${totalTonnage}kg</p>

        <p>Protein Gesamt: ${totalProtein}g</p>
      </div>
    `;
  });