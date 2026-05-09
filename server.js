const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// In-Memory Datenbank
let userData = {
  trainings: [],
  ernährung: [],
};

// ============ TRAINING LOGGER ============
app.post("/api/training/log", (req, res) => {
  const { day, übung, gewicht, reps, sets, rpe, notiz } = req.body;

  const trainingsEintrag = {
    datum: new Date().toISOString(),
    day,
    übung,
    gewicht,
    reps,
    sets,
    rpe,
    notiz,
    tonnage: gewicht * reps * sets,
  };

  userData.trainings.push(trainingsEintrag);

  // Demo Feedback (ohne API)
  const feedbackMessages = [
    "Sehr gute Leistung! Du machst gute Fortschritte! 💪",
    "Ausgezeichnet! Das war eine starke Session! 🔥",
    "Großartig! Deine Progression ist beständig! 📈",
    "Perfekt! Weiter so! 🚀",
  ];

  const randomFeedback =
    feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];

  res.json({
    success: true,
    trainingsEintrag,
    feedback: randomFeedback,
    message: "Training geloggt! ✅",
  });
});

// ============ ERNÄHRUNG LOGGER ============
app.post("/api/ernährung/log", (req, res) => {
  const { mahlzeit, proteinG, kalorien, notiz } = req.body;

  const ernährungsEintrag = {
    datum: new Date().toISOString(),
    mahlzeit,
    proteinG,
    kalorien,
    notiz,
  };

  userData.ernährung.push(ernährungsEintrag);

  // Berechne heute's Totale
  const today = new Date().toDateString();
  const heuteProtein = userData.ernährung
    .filter((e) => new Date(e.datum).toDateString() === today)
    .reduce((sum, e) => sum + e.proteinG, 0);

  const heuteKalorien = userData.ernährung
    .filter((e) => new Date(e.datum).toDateString() === today)
    .reduce((sum, e) => sum + e.kalorien, 0);

  // Demo Feedback
  let feedback = "";
  if (heuteProtein >= 210) {
    feedback = "🎉 Protein-Ziel erreicht! Sehr gut!";
  } else {
    const fehlend = 210 - heuteProtein;
    feedback = `Du brauchst noch ${Math.round(fehlend)}g Protein heute. Ein Shake würde helfen! 🥤`;
  }

  res.json({
    success: true,
    ernährungsEintrag,
    feedback,
    heuteProtein,
    heuteKalorien,
  });
});

// ============ STATISTIKEN ============
app.get("/api/stats", (req, res) => {
  // Trainings diese Woche
  const wocheTrainings = userData.trainings.filter((t) => {
    const tage = (Date.now() - new Date(t.datum)) / (1000 * 60 * 60 * 24);
    return tage <= 7;
  });

  const gesamtTonnage = wocheTrainings.reduce((sum, t) => sum + t.tonnage, 0);

  // Ernährung Durchschnitt
  const ernährungLetzteWoche = userData.ernährung.filter((e) => {
    const tage = (Date.now() - new Date(e.datum)) / (1000 * 60 * 60 * 24);
    return tage <= 7;
  });

  const proteinAvg =
    ernährungLetzteWoche.length > 0
      ? Math.round(
          ernährungLetzteWoche.reduce((sum, e) => sum + e.proteinG, 0) / 7
        )
      : 0;

  const caloriesAvg =
    ernährungLetzteWoche.length > 0
      ? Math.round(
          ernährungLetzteWoche.reduce((sum, e) => sum + e.kalorien, 0) / 7
        )
      : 0;

  res.json({
    trainingsAnzahlWoche: wocheTrainings.length,
    tonnageWoche: gesamtTonnage,
    proteinAvg,
    caloriesAvg,
    analyse: "Großartig! Du machst gute Fortschritte! Halte die Routine! 💪",
    allTrainings: userData.trainings.slice(-10),
  });
});

// ============ SERVER STARTEN ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Fitness Coach läuft auf http://localhost:${PORT}`);
  console.log(`📱 Öffne im Browser: http://localhost:${PORT}`);
  console.log(`⏸️  Zum Stoppen: Ctrl+C`);
});
