import { estimateOneRepMax } from "../rank";
import { parts } from "../data";

export function calculateXpGain({
  isTimeBased,
  reps,
  trainingWeight,
  sets,
}) {
  if (isTimeBased) {
    return Math.max(1, Math.round(Number(reps) / 10));
  }

  const oneRepMax = estimateOneRepMax(
    trainingWeight,
    reps
  );

  const setBonus = Number(sets || 1);

  return Math.max(
    1,
    Math.round(oneRepMax + setBonus * 2)
  );
}

export function getPartBestScoreFromRecords(
  records,
  part,
  getRecordScore
) {
  const scores = records
    .filter((record) => record.part === part)
    .map(getRecordScore);

  return Math.max(0, ...scores);
}

export function getOverallScoreFromRecords(
  records,
  getRecordScore
) {
  const scores = parts.map((part) =>
    getPartBestScoreFromRecords(
      records,
      part,
      getRecordScore
    )
  );

  const activeScores = scores.filter(
    (score) => score > 0
  );

  if (activeScores.length === 0) return 0;

  return (
    activeScores.reduce(
      (sum, score) => sum + score,
      0
    ) / activeScores.length
  );
}