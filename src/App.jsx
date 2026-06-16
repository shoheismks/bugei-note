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


import Home from "./pages/Home";
import Body from "./pages/Body";
import Training from "./pages/Training";
import Rank from "./pages/Rank";
import Achievement from "./pages/Achievement";
import MartialArts from "./pages/MartialArts";
import BudoJournal from "./pages/BudoJournal";
import Titles from "./pages/Titles";
import Missions from "./pages/Missions";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import AchievementPopup from "./components/AchievementPopup";
import Techniques from "./pages/Techniques";
import Backup from "./pages/Backup";
import Login from "./pages/Login";
import { supabase } from "./lib/supabase";

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

  const getOverallScore = () => {
    return getOverallScoreFromRecords(trainingRecords, getRecordScore);
  };

  const trainingStreak = getTrainingStreak({
    trainingRecords,
    martialRecords,
    journalRecords,
    bodyRecords,
  });

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

  const combatPower = getCombatPower({
    overallScore: getOverallScore(),
    martialXp: martialRecords.reduce(
      (sum, record) => sum + Number(record.xp || 0),
      0
    ),
    trainingStreak,
    journalRecords,
    bodyRecords,
    stepRecords,
    techniquePower,
  });
  const levelData =
  getLevelFromCombatPower(combatPower);

  const recommendedMission = getRecommendedMission({
  trainingRecords,
  martialRecords,
  journalRecords,
  bodyRecords,
  });

  const playerClass = getClassFromLevel(levelData.level);

  const checkAchievements = (records) => {
    return getUnlockedAchievementsFromRecords(
      records,
      (targetRecords) =>
        getOverallScoreFromRecords(targetRecords, getRecordScore),
      (targetRecords, part) =>
        getPartBestScoreFromRecords(targetRecords, part, getRecordScore),
      trainingStreak,
      stepRecords,
      learnedCount,
      masteredCount,
      techniqueLevels
    );
  };
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

  const overallScore = getOverallScore();
  const totalXp = getTotalXp(trainingRecords);

  const martialXp = martialRecords.reduce((sum, record) => {
    return sum + Number(record.xp || 0);
  }, 0);

  const {
  getNote,
  saveNote,
  } = useTechniqueNotes();

  const weightClass = getWeightClass(gender, savedWeight);
  const unlockedAchievements = checkAchievements(trainingRecords);

  const unlockedTitles = getUnlockedTitles({
    overallScore,
    totalXp: totalXp + martialXp,
    martialXp,
    unlockedAchievements,
  });

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

      {tab === "home" && (
        <Home
          overallScore={overallScore}
          totalXp={totalXp + martialXp}
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
          
        />
      )}

      {tab === "body" && (
        <Body
          weight={weight}
          setWeight={setWeight}
          bodyFat={bodyFat}
          setBodyFat={setBodyFat}
          bodyRecords={bodyRecords}
          saveBodyRecord={saveBodyRecord}
          deleteBodyRecord={deleteBodyRecord}
        />
      )}

      {tab === "training" && (
        <Training
          trainingPart={trainingPart}
          exercise={exercise}
          trainingWeight={trainingWeight}
          reps={reps}
          sets={sets}
          isTimeBased={isTimeBased}
          isDumbbell={isDumbbell}
          lastXp={lastXp}
          rankUpMessage={rankUpMessage}
          trainingRecords={trainingRecords}
          setExercise={setExercise}
          setTrainingWeight={setTrainingWeight}
          setReps={setReps}
          setSets={setSets}
          handlePartChange={handlePartChange}
          saveTrainingRecord={handleSaveTrainingRecord}
          deleteTrainingRecord={deleteTrainingRecord}
          getRecordScore={getRecordScore}
        />
      )}

      {tab === "rank" && (
        <Rank
          overallScore={overallScore}
          totalXp={totalXp + martialXp}
          weightClass={weightClass}
          getPartBestScore={getPartBestScore}
          getBestRecord={getBestRecord}
          getRecordScore={getRecordScore}
        />
      )}

      {tab === "achievement" && (
        <Achievement unlockedAchievements={unlockedAchievements} />
      )}

      {tab === "martial" && (
        <MartialArts
          martialArt={martialArt}
          setMartialArt={setMartialArt}
          martialMenu={martialMenu}
          setMartialMenu={setMartialMenu}
          martialCount={martialCount}
          setMartialCount={setMartialCount}
          martialRecords={martialRecords}
          saveMartialRecord={saveMartialRecord}
          deleteMartialRecord={deleteMartialRecord}
        />
      )}

      {tab === "journal" && (
        <BudoJournal
          journalText={journalText}
          setJournalText={setJournalText}
          journalSearch={journalSearch}
          setJournalSearch={setJournalSearch}
          journalRecords={journalRecords}
          saveJournalRecord={saveJournalRecord}
          deleteJournalRecord={deleteJournalRecord}
        />
      )}

      {tab === "titles" && (
        <Titles unlockedTitles={unlockedTitles} />
      )}

      {tab === "missions" && (
        <Missions
          trainingRecords={trainingRecords}
          martialRecords={martialRecords}
          journalRecords={journalRecords}
          bodyRecords={bodyRecords}
        />
      )}

      {tab === "steps" && (
        <Steps
          steps={steps}
          setSteps={setSteps}
          stepRecords={stepRecords}
          saveStepRecord={saveStepRecord}
          deleteStepRecord={deleteStepRecord}
        />
      )}

      {tab === "techniques" && (
        <Techniques
          getTechniqueLevel={getTechniqueLevel}
          updateTechniqueLevel={updateTechniqueLevel}
          learnedCount={learnedCount}
          masteredCount={masteredCount}
          getNote={getNote}
          saveNote={saveNote}
        />
      )}
      {tab === "backup" && (
        <Backup />
      )}
    </div>
     );
}

export default App;