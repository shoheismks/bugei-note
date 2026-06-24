import HomeMissionCard from "../components/home/HomeMissionCard";
import HomeCombatCard from "../components/home/HomeCombatCard";
import HomeRankCard from "../components/home/HomeRankCard";
import HomeProfileCard from "../components/home/HomeProfileCard";
import HomeBodyCard from "../components/home/HomeBodyCard";
import HomeTrainingStreakCard from "../components/home/HomeTrainingStreakCard";
import HomeStatusRadar from "../components/home/HomeStatusRadar";
import HomeQuestCard from "../components/home/HomeQuestCard";
import { BookOpen, Dumbbell, Footprints, Scale } from "lucide-react";

function Home({
  overallScore,
  totalXp,
  stepRecords,
  martialXp,
  martialRecords,
  trainingRecords,
  journalRecords,
  bodyRecords,
  combatPower,
  levelData,
  playerClass,
  recommendedMission,
  unlockedTitles,
  savedWeight,
  savedBodyFat,
  selectedTitle,
  changeTitle,
  resetAllData,
  openShortcut,
}) {
  const today = new Date().toDateString();

  const isToday = (date) => {
    return new Date(date).toDateString() === today;
  };

  const todayStepsRecord = (stepRecords || []).find((record) =>
    isToday(record.date)
  );

  const todaySteps = todayStepsRecord
    ? Number(todayStepsRecord.steps || 0)
    : 0;

  const bodyRecorded = bodyRecords.some((record) =>
    isToday(record.date)
  );

  const trainingDone = trainingRecords.some((record) =>
    isToday(record.date)
  );

  const missionCount = [
    trainingRecords.some((record) => isToday(record.date)),
    martialRecords.some((record) => isToday(record.date)),
    journalRecords.some((record) => isToday(record.date)),
    bodyRecords.some((record) => isToday(record.date)),
  ].filter(Boolean).length;

  return (
    <main className="home-main">
      <HomeProfileCard
        selectedTitle={selectedTitle}
        changeTitle={changeTitle}
        unlockedTitles={unlockedTitles}
      />

      <HomeQuestCard
        todaySteps={todaySteps}
        bodyRecorded={bodyRecorded}
        trainingDone={trainingDone}
      />

      <section className="card quick-actions-card">
        <h2>すぐ記録</h2>
        <div className="quick-actions">
          <button onClick={() => openShortcut("training", "strength")}>
            <Dumbbell aria-hidden="true" size={19} />
            <span>稽古を記録</span>
          </button>
          <button onClick={() => openShortcut("body", "record")}>
            <Scale aria-hidden="true" size={19} />
            <span>身体を記録</span>
          </button>
          <button onClick={() => openShortcut("training", "steps")}>
            <Footprints aria-hidden="true" size={19} />
            <span>歩数を記録</span>
          </button>
          <button onClick={() => openShortcut("training", "journal")}>
            <BookOpen aria-hidden="true" size={19} />
            <span>日誌を書く</span>
          </button>
        </div>
      </section>

      <HomeMissionCard
        missionCount={missionCount}
        recommendedMission={recommendedMission}
      />

      <HomeTrainingStreakCard
        trainingRecords={trainingRecords}
        martialRecords={martialRecords}
        stepRecords={stepRecords}
        journalRecords={journalRecords}
        bodyRecords={bodyRecords}
      />

      <HomeCombatCard
        combatPower={combatPower}
        levelData={levelData}
        playerClass={playerClass}
      />

      <HomeStatusRadar combatPower={combatPower} />

      <HomeRankCard
        overallScore={overallScore}
        martialXp={martialXp}
        martialRecords={martialRecords}
      />

      <HomeBodyCard
        totalXp={totalXp}
        savedWeight={savedWeight}
        savedBodyFat={savedBodyFat}
        resetAllData={resetAllData}
      />
    </main>
  );
}

export default Home;
