import { getTotalXp } from "../utils";
import { getUnlockedAchievementsFromRecords } from "../utils/achievementEngine";
import { getUnlockedTitles } from "../utils/titleEngine";
import {
  getOverallScoreFromRecords,
  getPartBestScoreFromRecords,
} from "../utils/trainingEngine";

export function useAchievements({
  trainingRecords,
  getRecordScore,
  trainingStreak,
  stepRecords,
  learnedCount,
  masteredCount,
  techniqueLevels,
  overallScore,
  martialXp,
}) {
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

  const totalXp = getTotalXp(trainingRecords);

  const unlockedAchievements = checkAchievements(trainingRecords);

  const unlockedTitles = getUnlockedTitles({
    overallScore,
    totalXp: totalXp + martialXp,
    martialXp,
    unlockedAchievements,
  });

  return {
    checkAchievements,
    totalXp,
    unlockedAchievements,
    unlockedTitles,
  };
}