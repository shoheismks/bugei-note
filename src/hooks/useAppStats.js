import { getTrainingStreak } from "../utils/streakEngine";
import { getCombatPower } from "../utils/combatPowerEngine";
import { getLevelFromCombatPower } from "../utils/levelEngine";
import { getClassFromLevel } from "../utils/classEngine";
import { getRecommendedMission } from "../utils/missionEngine";
import { getOverallScoreFromRecords } from "../utils/trainingEngine";

export function useAppStats({
  trainingRecords,
  martialRecords,
  journalRecords,
  bodyRecords,
  stepRecords,
  techniquePower,
  getRecordScore,
}) {
  const overallScore = getOverallScoreFromRecords(
    trainingRecords,
    getRecordScore
  );

  const martialXp = martialRecords.reduce((sum, record) => {
    return sum + Number(record.xp || 0);
  }, 0);

  const trainingStreak = getTrainingStreak({
    trainingRecords,
    martialRecords,
    journalRecords,
    bodyRecords,
  });

  const combatPower = getCombatPower({
    overallScore,
    martialXp,
    trainingStreak,
    journalRecords,
    bodyRecords,
    stepRecords,
    techniquePower,
  });

  const levelData = getLevelFromCombatPower(combatPower);

  const recommendedMission = getRecommendedMission({
    trainingRecords,
    martialRecords,
    journalRecords,
    bodyRecords,
  });

  const playerClass = getClassFromLevel(levelData.level);

  return {
    overallScore,
    martialXp,
    trainingStreak,
    combatPower,
    levelData,
    recommendedMission,
    playerClass,
  };
}