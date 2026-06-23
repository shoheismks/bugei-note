import HomeMissionCard from "../components/home/HomeMissionCard";
import HomeCombatCard from "../components/home/HomeCombatCard";
import HomeRankCard from "../components/home/HomeRankCard";
import HomeProfileCard from "../components/home/HomeProfileCard";
import HomeBodyCard from "../components/home/HomeBodyCard";
import HomeStreakCard from "../components/home/HomeStreakCard";
import HomeCalendarCard from "../components/home/HomeCalendarCard";
import HomeStatusRadar from "../components/home/HomeStatusRadar";
import HomeQuestCard from "../components/home/HomeQuestCard";

function Home({
  overallScore,
  totalXp,
  stepRecords,
  martialXp,
  martialRecords,
  trainingRecords,
  journalRecords,
  bodyRecords,
  trainingStreak,
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

      <HomeMissionCard
        missionCount={missionCount}
        recommendedMission={recommendedMission}
      />

      <HomeCalendarCard
        trainingRecords={trainingRecords}
        martialRecords={martialRecords}
        journalRecords={journalRecords}
        bodyRecords={bodyRecords}
      />

      <HomeCombatCard
        combatPower={combatPower}
        levelData={levelData}
        playerClass={playerClass}
      />

      <HomeStatusRadar combatPower={combatPower} />

      <HomeStreakCard trainingStreak={trainingStreak} />

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
