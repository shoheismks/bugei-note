// redeploy with supabase env
import { useEffect, useState } from "react";
import "./App.css";

import {
  exercisesByPart,
  dumbbellExercises,
  timeBasedExercises,
} from "./data";

import { getWeightClass, getTotalXp } from "./utils";

import {
  calculateXpGain,
  getPartBestScoreFromRecords,
  getOverallScoreFromRecords,
} from "./utils/trainingEngine";

import { useBodyRecords } from "./hooks/useBodyRecords";
import { useJournalRecords } from "./hooks/useJournalRecords";
import { useMartialRecords } from "./hooks/useMartialRecords";
import { useTrainingRecords } from "./hooks/useTrainingRecords";

import { getUnlockedAchievementsFromRecords } from "./utils/achievementEngine.js";
import { getUnlockedTitles } from "./utils/titleEngine.js";
import { getTrainingStreak } from "./utils/streakEngine.js";
import { getCombatPower } from "./utils/combatPowerEngine";
import { getLevelFromCombatPower } from "./utils/levelEngine";
import { getClassFromLevel } from "./utils/classEngine.js";
import { getRecommendedMission } from "./utils/missionEngine.js";
import Steps from "./pages/Steps";
import { useStepRecords } from "./hooks/useStepRecords";
import { useTechniques } from "./hooks/useTechniques";
import { useTechniqueNotes } from "./hooks/useTechniqueNotes";
import { useAuth } from "./hooks/useAuth";
import { useAppStats } from "./hooks/useAppStats";
import { useAchievements } from "./hooks/useAchievements";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import AchievementPopup from "./components/AchievementPopup";
import Login from "./pages/Login";
import { supabase } from "./lib/supabase";
import AppRoutes from "./components/AppRoutes";

function App() {

  const { session, authLoading } = useAuth();

  const [tab, setTab] = useState("home");

  const [gender, setGender] = useState(
    localStorage.getItem("gender") || "male"
  );

  const {
    weight,
    setWeight,
    bodyFat,
    setBodyFat,
    savedWeight,
    savedBodyFat,
    bodyRecords,
    saveBodyRecord,
    deleteBodyRecord,
    resetBodyRecords,
  } = useBodyRecords();

  const {
    trainingRecords,
    setTrainingRecords,
    trainingPart,
    setTrainingPart,
    exercise,
    setExercise,
    trainingWeight,
    setTrainingWeight,
    reps,
    setReps,
    sets,
    setSets,
    deleteTrainingRecord,
    getRecordScore,
    resetTrainingRecords,
  } = useTrainingRecords();

  const {
    martialArt,
    setMartialArt,
    martialMenu,
    setMartialMenu,
    martialCount,
    setMartialCount,
    martialRecords,
    saveMartialRecord,
    deleteMartialRecord,
    resetMartialRecords,
  } = useMartialRecords();

  const {
    journalText,
    setJournalText,
    journalSearch,
    setJournalSearch,
    journalRecords,
    saveJournalRecord,
    deleteJournalRecord,
    resetJournalRecords,
  } = useJournalRecords();

  const [lastXp, setLastXp] = useState(null);
  const [rankUpMessage, setRankUpMessage] = useState(null);
  const [newAchievement, setNewAchievement] = useState(null);

  const [selectedTitle, setSelectedTitle] = useState(
    localStorage.getItem("selectedTitle") || "現代サムライ"
  );

  const isTimeBased = timeBasedExercises.includes(exercise);
  const isDumbbell = dumbbellExercises.includes(exercise);

  const saveGender = (value) => {
    setGender(value);
    localStorage.setItem("gender", value);
  };

  const changeTitle = (title) => {
    setSelectedTitle(title);
    localStorage.setItem("selectedTitle", title);
  };

  const getPartBestScore = (part) => {
    return getPartBestScoreFromRecords(
      trainingRecords,
      part,
      getRecordScore
    );
  };

  const getBestRecord = (part) => {
    const records = trainingRecords.filter((record) => record.part === part);

    if (records.length === 0) return null;

    return records.reduce((best, current) => {
      return getRecordScore(current) > getRecordScore(best) ? current : best;
    });
  };

   const {
    steps,
    setSteps,
    stepRecords,
    saveStepRecord,
    deleteStepRecord,
    resetStepRecords,
  } = useStepRecords();

  const {
    techniqueLevels,
    getTechniqueLevel,
    updateTechniqueLevel,
    resetTechniques,
    learnedCount,
    masteredCount,
    getTechniquePower,
  } = useTechniques();

  const techniquePower = getTechniquePower();
    const {
      overallScore,
      martialXp,
      trainingStreak,
      combatPower,
      levelData,
      recommendedMission,
      playerClass,
    } = useAppStats({
      trainingRecords,
      martialRecords,
      journalRecords,
      bodyRecords,
      stepRecords,
      techniquePower,
      getRecordScore,
    });

    const {
  checkAchievements,
  totalXp,
  unlockedAchievements,
  unlockedTitles,
} = useAchievements({
  trainingRecords,
  getRecordScore,
  trainingStreak,
  stepRecords,
  learnedCount,
  masteredCount,
  techniqueLevels,
  overallScore,
  martialXp,
});

    const handleSaveTrainingRecord = () => {
  saveTrainingRecord({
    isTimeBased,
    isDumbbell,
    checkAchievements,
    getPartBestScore,
    setLastXp,
    setRankUpMessage,
    setNewAchievement,
  });
};

  const resetAllData = () => {
    const result = window.confirm("すべての記録を削除しますか？");

    if (!result) return;

    localStorage.clear();

    setGender("male");
    setLastXp(null);
    setRankUpMessage(null);
    setNewAchievement(null);

    resetBodyRecords();
    resetTrainingRecords();
    resetMartialRecords();
    resetJournalRecords();

    setSelectedTitle("現代サムライ");
    resetStepRecords();
    resetTechniques();
  };

  const handlePartChange = (part) => {
    setTrainingPart(part);
    setExercise(exercisesByPart[part][0]);
    setTrainingWeight("");
    setReps("");
    setSets("");
    setRankUpMessage(null);
  };

  const {
  getNote,
  saveNote,
  } = useTechniqueNotes();

  const weightClass = getWeightClass(gender, savedWeight);

  if (authLoading) {
  return (
    <div className="app">
      <main>
        <section className="card hero">
          <h2>読み込み中</h2>
        </section>
      </main>
    </div>
  );
}

if (!session) {
  return (
    <div className="app">
      <Login />
    </div>
  );
}

  return (
    <div className="app">
      <AchievementPopup achievement={newAchievement} />

      <Header />

      <section className="card">
        <button
          className="danger"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.reload();
          }}
        >
          ログアウト
        </button>
      </section>
      <Navigation setTab={setTab} />

      

<AppRoutes
  tab={tab}
  overallScore={overallScore}
  totalXp={totalXp}
  martialXp={martialXp}
  martialRecords={martialRecords}
  gender={gender}
  weightClass={weightClass}
  savedWeight={savedWeight}
  savedBodyFat={savedBodyFat}
  selectedTitle={selectedTitle}
  changeTitle={changeTitle}
  unlockedTitles={unlockedTitles}
  saveGender={saveGender}
  resetAllData={resetAllData}
  trainingRecords={trainingRecords}
  journalRecords={journalRecords}
  bodyRecords={bodyRecords}
  trainingStreak={trainingStreak}
  combatPower={combatPower}
  levelData={levelData}
  playerClass={playerClass}
  recommendedMission={recommendedMission}
  stepRecords={stepRecords}
  weight={weight}
  setWeight={setWeight}
  bodyFat={bodyFat}
  setBodyFat={setBodyFat}
  saveBodyRecord={saveBodyRecord}
  deleteBodyRecord={deleteBodyRecord}
  trainingPart={trainingPart}
  exercise={exercise}
  trainingWeight={trainingWeight}
  reps={reps}
  sets={sets}
  isTimeBased={isTimeBased}
  isDumbbell={isDumbbell}
  lastXp={lastXp}
  rankUpMessage={rankUpMessage}
  setExercise={setExercise}
  setTrainingWeight={setTrainingWeight}
  setReps={setReps}
  setSets={setSets}
  handlePartChange={handlePartChange}
  handleSaveTrainingRecord={handleSaveTrainingRecord}
  deleteTrainingRecord={deleteTrainingRecord}
  getRecordScore={getRecordScore}
  getPartBestScore={getPartBestScore}
  getBestRecord={getBestRecord}
  unlockedAchievements={unlockedAchievements}
  martialArt={martialArt}
  setMartialArt={setMartialArt}
  martialMenu={martialMenu}
  setMartialMenu={setMartialMenu}
  martialCount={martialCount}
  setMartialCount={setMartialCount}
  saveMartialRecord={saveMartialRecord}
  deleteMartialRecord={deleteMartialRecord}
  journalText={journalText}
  setJournalText={setJournalText}
  journalSearch={journalSearch}
  setJournalSearch={setJournalSearch}
  saveJournalRecord={saveJournalRecord}
  deleteJournalRecord={deleteJournalRecord}
  steps={steps}
  setSteps={setSteps}
  saveStepRecord={saveStepRecord}
  deleteStepRecord={deleteStepRecord}
  getTechniqueLevel={getTechniqueLevel}
  updateTechniqueLevel={updateTechniqueLevel}
  learnedCount={learnedCount}
  masteredCount={masteredCount}
  getNote={getNote}
  saveNote={saveNote}

  
/>

</div>
);
}
export default App;