export function getUnlockedTitles({
  overallScore,
  totalXp,
  martialXp,
  unlockedAchievements,
}) {
  const unlocked = ["現代サムライ"];

  if (totalXp >= 100) unlocked.push("畳の妖精");
  if (totalXp >= 1000) unlocked.push("道場の主");
  if (totalXp >= 3000) unlocked.push("現代武士");

  if (overallScore >= 70) unlocked.push("古武術オタク");
  if (overallScore >= 80) unlocked.push("令和の武芸者");
  if (overallScore >= 90) unlocked.push("剣聖");

  if (martialXp >= 25) unlocked.push("木刀持ち");
  if (martialXp >= 100) unlocked.push("道場の常連");
  if (martialXp >= 300) unlocked.push("百本斬り");
  if (martialXp >= 1000) unlocked.push("兵法者");

  if (unlockedAchievements.length >= 5) {
    unlocked.push("白画面討伐者");
    unlocked.push("バグ斬り");
  }

  if (unlockedAchievements.length >= 20) {
    unlocked.push("道場の柱");
    unlocked.push("SHU・HA・RI館主");
  }

  return unlocked;
}
