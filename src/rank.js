export const rankLabels = [
  "10級", "9級", "8級", "7級", "6級",
  "5級", "4級", "3級", "2級", "1級",
  "初段", "二段", "三段", "四段", "五段",
  "六段", "七段", "八段", "九段", "十段",
];

export const samuraiTitles = [
  "見習い", "見習い", "門人", "門人", "兵卒",
  "兵卒", "足軽", "足軽", "武者", "武者",
  "侍", "侍", "旗本", "旗本", "剣豪",
  "剣豪", "師範", "大名", "達人", "剣聖",
];

export function estimateOneRepMax(weight, reps) {
  const w = Number(weight);
  const r = Number(reps);

  if (!w || !r) return 0;

  return w * (1 + r / 30);
}

export function scoreToIndex(score) {
  if (!score || score <= 0) return -1;

  return Math.min(rankLabels.length - 1, Math.floor(score / 5));
}

export function scoreToRank(score) {
  const index = scoreToIndex(score);

  if (index < 0) return "未記録";

  return rankLabels[index];
}

export function scoreToSamuraiTitle(score) {
  const index = scoreToIndex(score);

  if (index < 0) return "未記録";

  return samuraiTitles[index];
}

export function scoreToXp(score) {
  if (!score || score <= 0) {
    return {
      currentXp: 0,
      nextXp: 100,
      percent: 0,
      remaining: 100,
    };
  }

  const currentLevelScore = Math.floor(score / 5) * 5;
  const progress = score - currentLevelScore;

  const currentXp = Math.round(progress * 20);
  const nextXp = 100;
  const percent = Math.min(100, currentXp);
  const remaining = Math.max(0, nextXp - currentXp);

  return {
    currentXp,
    nextXp,
    percent,
    remaining,
  };
}