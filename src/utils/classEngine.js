export function getClassFromLevel(level) {
  if (level >= 70) return "武神";
  if (level >= 60) return "剣聖";
  if (level >= 50) return "剣豪";
  if (level >= 40) return "達人";
  if (level >= 30) return "兵法者";
  if (level >= 20) return "武士";
  if (level >= 10) return "足軽";

  return "見習い武士";
}